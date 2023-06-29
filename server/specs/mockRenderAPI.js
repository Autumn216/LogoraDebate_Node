const httpClient = require("../helpers/httpClient");
const { createMockDebate } = require("./data/debate");
const { createMockSettings } = require("./data/settings");
const { createMockSource } = require("./data/source");
const { createMockConsultation } = require("./data/consultation");
const { createMockArgument } = require("./data/argument");
const nock = require('nock');

const mockUrl = "https://mock.logora.fr"; // Fake URL for testing purposes

const getSource = (apiKey, sourceUid) => {
	const route = "/sources/" + sourceUid;
    let responseData = {
        data: {
            success: true,
            data: {
                resource: {
                    ...createMockSource()
                }
            }	
        }   
    };

	return mock_client_get(route, apiKey, responseData);
}

const getSettings = (shortname) => {
	const route = "/settings?";
	const query = {
		shortname: shortname,
	};
    let responseData = {
        data: {
            success: true,
            data: {
                resource: {
                    ...createMockSettings()
                }
            }	
        }   
    };

	const queryString = new URLSearchParams(query).toString();
	return mock_client_post(route + queryString, null, responseData);
}

const getSynthesis = (apiKey, sourceUid) => {
    let route = "/sources/" + sourceUid + "/synthesis";
    let responseCode = 200;
    let responseData = {
        data: {
            success: true,
            data: {
                resource: {
                    ...createMockDebate()
                },
                resource_type: "Group"
            }
        } 
    };

    if (sourceUid == "404") {
        responseCode = 404;
        responseData = {
            data: {
                success: false,
                data: {
                    resource: {
                        ...createMockDebate()
                    },
                    resource_type: "Group"
                }	
            }   
        };
    };

    return mock_client_get(route, apiKey, responseData, responseCode);
}

const getSynthesisById = (apiKey, debateId) => {
	const route = "/groups/" + debateId + "/synthesis_by_id";
    let responseCode = 200;
    let responseData = {
        data: {
            success: true,
            data: {
                resource: {
                    ...createMockDebate()
                },
                resource_type: "Group"
            }	
        }   
    };

    if (debateId == 500) {
        responseCode = 500;
        responseData = {
            data: {
                success: false,
                data: {
                    resource: {
                        ...createMockDebate()
                    },
                    resource_type: "Group"
                }	
            }   
        };
    }

	return mock_client_get(route, apiKey, responseData, responseCode);
}

const getConsultationSynthesis = (apiKey, consultationId) => {
	const route = "/consultations/" + consultationId + "/synthesis";
    let responseCode = 200;
    let responseData = {
        data: {
            success: true,
            data: {
                resource: {
                    ...createMockConsultation()
                },
                resource_type: "Consultation"
            }	
        }   
    };

    if (consultationId == 500) {
        responseCode = 500;
        responseData = {
            data: {
                success: false,
                data: {
                    resource: {
                        ...createMockConsultation()
                    },
                    resource_type: "Consultation"
                }	
            }   
        };
    };

	return mock_client_get(route, apiKey, responseData, responseCode);
}

const getArgument = (apiKey, argumentId) => {
	const route = "/messages/" + argumentId;
    let responseCode = 200;
    let responseData = {
        data: {
            success: true,
            data: {
                resource: {
                    ...createMockArgument()
                },
                resource_type: "argument"
            }	
        }   
    };

    if (argumentId == 500) {
        responseCode = 500;
        responseData = {
            data: {
                success: false,
                data: {
                    resource: {
                        ...createMockArgument()
                    },
                    resource_type: "argument"
                }	
            }   
        };
    };
	return mock_client_get(route, apiKey, responseData, responseCode);
}

const mock_client_get = (route, apiKey, responseData, responseCode = 200) => {
    nock(mockUrl)
        .get(addClientTokenToPath(route, apiKey))
        .reply(responseCode)
    
    return new Promise((resolve, reject) => {
        httpClient.get(mockUrl + addClientTokenToPath(route, apiKey))
            .then(() => {
                resolve(responseData)
            })
            .catch((err) => {
                reject(err);
            })
    });
}

const mock_client_post = (route, apiKey, responseData) => {
    nock(mockUrl)
        .post(addClientTokenToPath(route, apiKey))
        .reply(200)
    
    return new Promise((resolve, reject) => {
        httpClient.post(mockUrl + addClientTokenToPath(route, apiKey))
            .then(() => {
                resolve(responseData)
            })
            .catch((err) => {
                reject(err);
            })
    });
}

const addClientTokenToPath = (path, apiKey) => {
    let pathParams = path.split("?")[1];
	if (pathParams) {
		return path + "&api_key=" + apiKey;
	} else {
		return path + "?api_key=" + apiKey;
	}
}


module.exports = {
    getSynthesis,
    getSynthesisById,
    getConsultationSynthesis,
    getArgument,
    getSource,
    getSettings
}
