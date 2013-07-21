module.exports = 
  { "development":
    { "driver":   "mongodb",
      "url": "mongodb://admin:1234@localhost:27017/didgeridoo"
    }
  , "test":
    { "driver":   "mongodb"
    }
  , "production":
    { "driver":   "mongodb"
    }
  };
