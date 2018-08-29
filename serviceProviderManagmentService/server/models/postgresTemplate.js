import Sequelize from 'sequelize';
import sequelize from '../../config/sequelize';

const PostgresTemplateModel = sequelize.define('patient', {
    flag: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
    myDate: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    title: { type: Sequelize.STRING, allowNull: false },
    someUnique: { type: Sequelize.STRING, unique: true },
    identifier: { type: Sequelize.STRING, primaryKey: true },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        get() {
            const title = this.getDataValue('title');
            // 'this' allows you to access attributes of the instance
            return this.getDataValue('name') + ' (' + title + ')';
        },
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        set(val) {
            this.setDataValue('title', val.toUpperCase());
        }
    },
    incrementMe: { type: Sequelize.INTEGER, autoIncrement: true },
    states: {
        type:   Sequelize.ENUM,
        values: ['active', 'pending', 'deleted']
    },
    // It is possible to create foreign keys:
    bar_id: {
        type: Sequelize.INTEGER,
    
        references: {
        // This is a reference to another model
        model: Bar,
    
        // This is the column name of the referenced model
        key: 'id',
    
        // This declares when to check the foreign key constraint. PostgreSQL only.
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
    },
    foo: {
        type: Sequelize.STRING,
        validate: {
          is: ["^[a-z]+$",'i'],     // will only allow letters
          is: /^[a-z]+$/i,          // same as the previous example using real RegExp
          not: ["[a-z]",'i'],       // will not allow letters
          isEmail: true,            // checks for email format (foo@bar.com)
          isUrl: true,              // checks for url format (http://foo.com)
          isIP: true,               // checks for IPv4 (129.89.23.1) or IPv6 format
          isIPv4: true,             // checks for IPv4 (129.89.23.1)
          isIPv6: true,             // checks for IPv6 format
          isAlpha: true,            // will only allow letters
          isAlphanumeric: true,     // will only allow alphanumeric characters, so "_abc" will fail
          isNumeric: true,          // will only allow numbers
          isInt: true,              // checks for valid integers
          isFloat: true,            // checks for valid floating point numbers
          isDecimal: true,          // checks for any numbers
          isLowercase: true,        // checks for lowercase
          isUppercase: true,        // checks for uppercase
          notNull: true,            // won't allow null
          isNull: true,             // only allows null
          notEmpty: true,           // don't allow empty strings
          equals: 'specific value', // only allow a specific value
          contains: 'foo',          // force specific substrings
          notIn: [['foo', 'bar']],  // check the value is not one of these
          isIn: [['foo', 'bar']],   // check the value is one of these
          notContains: 'bar',       // don't allow specific substrings
          len: [2,10],              // only allow values with length between 2 and 10
          isUUID: 4,                // only allow uuids
          isDate: true,             // only allow date strings
          isAfter: "2011-11-05",    // only allow date strings after a specific date
          isBefore: "2011-11-05",   // only allow date strings before a specific date
          max: 23,                  // only allow values <= 23
          min: 23,                  // only allow values >= 23
          isCreditCard: true,       // check for valid credit card numbers
    
          // custom validations are also possible:
          isEven(value) {
            if (parseInt(value) % 2 != 0) {
              throw new Error('Only even values are allowed!')
              // we also are in the model's context here, so this.otherField
              // would get the value of otherField if it existed
            }
          }
        }
    },
    isInt: {
        msg: "Must be an integer number of pennies"
    },
    isIn: {
        args: [['en', 'zh']],
        msg: "Must be English or Chinese"
    },
    latitude: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
        validate: { min: -90, max: 90 }
    },
    longitude: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
        validate: { min: -180, max: 180 }
    },
    username: Sequelize.STRING,
    phone_number: Sequelize.STRING,
    first_name: Sequelize.STRING,
    last_name: Sequelize.STRING,
    user_type: Sequelize.STRING,
    status: Sequelize.BOOLEAN
}, {
    validate: {
      bothCoordsOrNone() {
        if ((this.latitude === null) !== (this.longitude === null)) {
          throw new Error('Require either both latitude and longitude or neither')
        }
      }
    }
}, {
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: false,
  
    // don't delete database entries but set the newly added attribute deletedAt
    // to the current date (when deletion was done). paranoid will only work if
    // timestamps are enabled
    paranoid: true,
  
    // don't use camelcase for automatically added attributes but underscore style
    // so updatedAt will be updated_at
    underscored: true,
  
    // disable the modification of table names; By default, sequelize will automatically
    // transform all passed model names (first parameter of define) into plural.
    // if you don't want that, set the following
    freezeTableName: true,
  
    // define the table's name
    tableName: 'my_very_custom_table_name',
  
    // Enable optimistic locking.  When enabled, sequelize will add a version count attribute
    // to the model and throw an OptimisticLockingError error when stale instances are saved.
    // Set to true or a string with the attribute name you want to use to enable.
    version: true
}, {
    hooks: {
      beforeValidate: (user, options) => {
        user.mood = 'happy';
      },
      afterValidate: (user, options) => {
        user.username = 'Toni';
      }
    }
});

export default PostgresTemplateModel;