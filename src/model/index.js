/**
 * μ Nano API
 *
 * Just a prototype.
 *
 * @author John Murowaniecki <jmurowaniecki@gmail.com>
 * @link   https://github.com/compilou/nano-api
 *
 * @class  ORM
 *
 */
const Mongoose = require('mongoose');

const { Schema } = Mongoose;

const {
  MONGODB_URL = process.env.MONGODB_RESOURCE,
  MONGODB_CFG = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }
} = process.env;

class ORM {

  /**
   * Creates an instance of ORM self injecting Mongoose.
   *
   * @author John Murowaniecki <john@compilou.com.br>
   *
   * @param {Array} Array of strings - models files.
   *
   * @memberof ORM
   */
  constructor (models) {
    this.Models = {};
    this.Schema = {};

    this.DB = Mongoose;
    this.DB.connect(MONGODB_URL, MONGODB_CFG, (err) => {
      if (err) {
        process.exit(1);
      }
    });

    models.forEach((model) => {
      const Model = model.charAt(0).toUpperCase() + model.slice(1);
      try {
        this.Schema[model] = new Schema(require(`./${model}`), { collection: `${model}Collection` });
        this.Models[model] = Mongoose.model(model, this.Schema[model]);
        this[Model] = this.Models[model];
      } catch (error) {
        // console.log("Error loading model", model, error);
      }
    });
  }
}

module.exports = (models) => new ORM(models);
