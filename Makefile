#
#  μ.Makefile options:
#
 BOLD  = \033[1m
/BOLD  = \033[0m
STRING = "$(BOLD)%-10s$(/BOLD)%s\n"
HELP   = sed -E 's/(`.*`)/\\e[1m\1\\e[0m/'

TEXT_SERVICE = "%-10s $(BOLD)Ok$(/BOLD)\n"
_HOSTSFILE_  = /etc/hosts

CIRCLECI_DIR = ./.circleci
CIRCLECI_PRE = $(CIRCLECI_DIR)/pre-processed.yml
CIRCLECI_PWN = --volume "/var/run/docker.sock:/var/run/docker.sock"
CIRCLECI_MNT = --volume "$(shell pwd):/workdir"
CIRCLECI_XXX = sed 's/\\\#/\\\\\\\\\#/; s/@/\\\\@/; s/\!/\\\\!/'
CIRCLECI_AWK = awk '/.+/ { print("--env "$$0) }' | sed -E 's/([&]+)/\\\1/g'
CIRCLECI_CFG = circleci config process
CIRCLECI_RUN = circleci local execute -c $(CIRCLECI_PRE) $(CIRCLECI_MNT) $(CIRCLECI_ENV)
CIRCLECI_ENV = $(shell cat .circleci/.env 2> /dev/null | $(CIRCLECI_AWK))
DOCKER_SETUP = $(shell cat           .env 2> /dev/null | $(CIRCLECI_AWK))
DOCKER_START = docker run --rm -v "$(shell pwd):/worker" $(DOCKER_SETUP)
PROJECT_ADDR = $(shell [ -e .env ] && ( \
	cat .env | grep APP_URL | awk -F'=' \
		'{ print($$2); }'   | sed -E    \
		's/.*\/\/(.*)[\/]*.*/\1/''''' ) \
		|| echo "$$APP_URL")

MESSAGEHOSTCFG = "- Add an entry to $(BOLD)$(PROJECT_ADDR)$(/BOLD) in your $(BOLD)$(_HOSTSFILE_)$(/BOLD) before continue."
MESSAGEREQUEST = "- $(BOLD)$$n$(/BOLD) is installed."
MESSAGEREQUIRE = "- Install $(BOLD)$$n$(/BOLD) before continue."

define REQUIRE
defFuncREQUIRE(){ \
	echo """"" "; \
	for n in $$@; \
	do which $$n >/dev/null; \
		r="$${?}"; \
		[ "$${r}" -gt 0 ] \
			&& { i=$(MESSAGEREQUIRE); } \
			|| { i=$(MESSAGEREQUEST); };\
		echo "$${i}"; \
		[ $$r -eq 1 ] \
		&& { exit 1;} \
		|| { true 0;};\
	done;\
}; \
defFuncREQUIRE
endef



DEFAULT: first-execution

first-execution:
	@([ -e .env ] \
	&& { $(MAKE) -s help; } \
	|| { $(MAKE) -s demands \
	&& cp .env.templa* .env \
	&& echo "\nExecute $(BOLD)make install$(/BOLD) or $(BOLD)make launch$(/BOLD) to continue.";})



demands: check-host # Check for requirements.
	@$(REQUIRE) circleci docker

check-host:
	@cat /etc/hosts | grep -q "$(PROJECT_ADDR)" || echo $(MESSAGEHOSTCFG)


#
install: # Build container.
	@docker build --force-rm -t lambdadeveloper/nano-api . -f ./Dockerfile


#
launch: # Executes application locally
	@echo $(DOCKER_START) -it -p "80:80" lambdadeveloper/nano-api

launch-cmd: # Executes application locally
	@$(DOCKER_START) -it -p "80:80" lambdadeveloper/nano-api sh

launch-dry: # Executes application locally without port forward
	@$(DOCKER_START) -it lambdadeveloper/nano-api sh


#
circleci-pre-process:  #- Preprocess CircleCI config file to run locally.
	@$(CIRCLECI_CFG) $(CIRCLECI_DIR)/config.yml > $(CIRCLECI_PRE)

circleci-qa: circleci-pre-process #- Runs CircleCI quality workflow locally.
	@$(CIRCLECI_RUN) --job quality

circleci-build: circleci-pre-process
	@$(CIRCLECI_RUN) --job build

circleci-deploy: circleci-pre-process
	@$(CIRCLECI_RUN) --job deploy

circleci: circleci-qa circleci-build circleci-deploy # Runs CircleCI workflow locally.



#
help: # Show this help.
	@(echo """"""""""""""""""" \
	$$(awk 'BEGIN {FS=":.*?#"} \
	/^([A-z0-9.\-_?]+:.*|^)#/{ \
	gsub("(:|^)#( |^|$$)",""); \
	if(substr($$1,1,1) !~ /-/  \
	&& substr($$2,1,1) !~ /-/) \
	printf $(STRING),$$1,$$2}' \
	$(MAKEFILE_LIST)|$(HELP))" \
	||((((((($(MAKE) -s))))))))

#
%:
	@:
