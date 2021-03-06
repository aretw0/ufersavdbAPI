const connector = require("./connector");
const response = require("../response");

const db = connector.db;
const queryResult = connector.queryResult;

function getStations(req, res, next) {
  return db
    .func("getStations", undefined, queryResult.many)
    .then(function(data) {
      res
        .status(200)
        .json(response.success(data, "Retornou todas as estações"));
    })
    .catch(function(err) {
      res.status(500).json(response.failure(err));
    });
}

function getStationsName(req, res, next) {
  return db
    .func("getStsName", undefined, queryResult.many)
    .then(function(data) {
      res
        .status(200)
        .json(response.success(data, "Retornou o nome de todas as estações"));
    })
    .catch(function(err) {
      res.status(500).json(response.failure(err));
    });
}
// INFELIZMENTE a única situação em que não deu pra ser uma função
// Esse array_agg retorna um RECORD e pseudotypes não podem ser usados em functions
function getValSts(req, res, next) {
  return db
    .any(
      "select st.idStation, st.name, st.lat, st.lon, json_agg((ss.slot, ss.bike)) as slots from bike_station as st, station_slot as ss where ss.idStation = st.idStation AND ss.state = TRUE AND st.state = TRUE GROUP BY st.idStation;"
    )
    .then(function(data) {
      res
        .status(200)
        .json(
          response.success(
            data,
            "Retornou informações válidas de estações válidas"
          )
        );
    })
    .catch(function(err) {
      res.status(500).json(response.failure(err));
    });
}

function getStation(req, res, next) {
  const stID = parseInt(req.params.id);
  return db
    .func("getStation", stID, queryResult.one)
    .then(function(data) {
      res.status(200).json(response.success(data, "Retornou uma estação"));
    })
    .catch(function(err) {
      res.status(500).json(response.failure(err));
    });
}

function getStationLogs(req, res, next) {
  return db
    .func("getHistsStation", null, queryResult.many)
    .then(function(data) {
      res
        .status(200)
        .json(
          response.success(data, "Retornou o histórico de todas as estações")
        );
    })
    .catch(function(err) {
      res.status(500).json(response.failure(err));
    });
}

function getStationLog(req, res, next) {
  const stID = parseInt(req.params.id);
  return db
    .func("getHistStation", [stID, null], queryResult.many)
    .then(function(data) {
      res
        .status(200)
        .json(response.success(data, "Retornou o histórico de uma estação"));
    })
    .catch(function(err) {
      res.status(500).json(response.failure(err));
    });
}

function createStation(req, res, next) {
  return db
    .func("createBikeStation", [
      req.body.name,
      req.body.password,
      req.body.lat,
      req.body.lon
    ])
    .then(function() {
      res.status(200).json(response.success({}, "Uma estação inserida"));
    })
    .catch(function(err) {
      res.status(500).json(response.failure(err));
    });
}

function updateStation(req, res, next) {
  return db
    .func(
      "upd_bike_station",
      [
        parseInt(req.body.idstation),
        req.body.name,
        req.body.password,
        req.body.lat,
        req.body.lon,
        req.body.state
      ],
      queryResult.one
    )
    .then(function() {
      res.status(200).json(response.success({}, "Atualizou uma estação"));
    })
    .catch(function(err) {
      res.status(500).json(response.failure(err));
    });
}

function removeStations(req, res, next) {
  return db
    .func("delStations", undefined, queryResult.one)
    .then(function(result) {
      res.status(200).json(response.success({}, "Removeu 1 estação"));
    })
    .catch(function(err) {
      res.status(500).json(response.failure(err));
    });
}

function removeStation(req, res, next) {
  const stID = parseInt(req.params.id);
  return db
    .func("delStation", stID, queryResult.many)
    .then(function(result) {
      res.status(200).json(response.success({}, "Removeu uma estação"));
    })
    .catch(function(err) {
      res.status(500).json(response.failure(err));
    });
}

function changeStationState(req, res, next) {
  const stID = parseInt(req.params.id);
  return db
    .func("changeStationState", stID, queryResult.one)
    .then(function(result) {
      res.status(200).json(response.success({}, "Mudou o estado de 1 estação"));
    })
    .catch(function(err) {
      res.status(500).json(response.failure(err));
    });
}
function assignSlot(req, res, next) {
  const stID = parseInt(req.params.id);
  return db
    .func("assignSlot", stID, queryResult.one)
    .then(function(result) {
      res
        .status(200)
        .json(response.success({}, "Adicionou 1 slot a uma estação"));
    })
    .catch(function(err) {
      res.status(500).json(response.failure(err));
    });
}
function deassignSlot(req, res, next) {
  const stID = parseInt(req.params.st);
  const sl = parseInt(req.params.sl);
  return db
    .func("deassignSlot", [stID, sl], queryResult.one)
    .then(function(result) {
      res
        .status(200)
        .json(
          response.success({}, "Removeu o " + sl + "º slot de uma estação")
        );
    })
    .catch(function(err) {
      res.status(500).json(response.failure(err));
    });
}

function changeSlotState(req, res, next) {
  const stID = parseInt(req.params.st);
  const sl = parseInt(req.params.sl);
  return db
    .func("changeSlotState", [stID, sl], queryResult.one)
    .then(function(result) {
      res
        .status(200)
        .json(
          response.success(
            {},
            "Alterou o estado do " + sl + "º slot de uma estação"
          )
        );
    })
    .catch(function(err) {
      res.status(500).json(response.failure(err));
    });
}

function getSlots(req, res, next) {
  const stID = parseInt(req.params.id);
  return db
    .func("getSlots", stID, queryResult.many)
    .then(function(result) {
      res
        .status(200)
        .json(response.success(result, "Retornou os slots de uma estação"));
    })
    .catch(function(err) {
      res.status(500).json(response.failure(err));
    });
}

module.exports = {
  getStations: getStations, // feito
  getStationsName: getStationsName, // feito
  getValSts: getValSts,
  getStation: getStation, // feito
  changeStationState: changeStationState, // feito
  getStationLogs: getStationLogs, // feito mas não funciona
  getStationLog: getStationLog, // feito
  assignSlot: assignSlot, // feito
  deassignSlot: deassignSlot, // feito
  changeSlotState: changeSlotState, // feito
  getSlots: getSlots, // feito
  createStation: createStation, // feito
  updateStation: updateStation, // feito
  removeStations: removeStations, // feito
  removeStation: removeStation // feito
};
