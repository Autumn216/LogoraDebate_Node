const httpClient = require("./httpClient");

const apiURL = process.env.API_URL;

const getList = (apiKey, resource, page, per_page, query = "", sort = "-created_at", outset = 0, filters = {}, countless = false) => {
	const route = "/" + resource + "?";
	let data = {
		page: page,
		per_page: per_page,
		sort: sort,
	};
	if (query) {
		data["query"] = query;
	}
	if(countless) {
		data["countless"] = countless;
	}
	if (outset !== 0) {
		data["outset"] = outset;
	}
	if (Object.keys(filters).length > 0) {
		data = { ...data, ...filters };
	}
	const queryString = new URLSearchParams(data).toString();
	return client_get(route + queryString, apiKey);
}

const getSettings = (shortname) => {
	const route = "/settings?";
	const query = {
		shortname: shortname,
	};
	const queryString = new URLSearchParams(query).toString();
	return client_post(route + queryString, null);
}

const getDebate = (apiKey, debateSlug) => {
	const route = "/groups/" + debateSlug;
	return client_get(route, apiKey);
}

const getDebateByName = (apiKey, name) => {
	const route = "/groups?";
	const query = {
		by_name: name,
	};
	const queryString = new URLSearchParams(query).toString();
	return client_get(route + queryString, apiKey);
}

const createDebate = (apiKey, debate) => {
	const route = "/groups/";
	const data = {
		name: debate.name || debate.identifier,
		origin_image_url: debate.image_url,
		position_list: JSON.stringify(debate.position_list) || '["Pour", "Contre"]',
		content_uids: debate.identifier.toString(),
	};
	return client_post(route, data, apiKey);
}

const getDebateArguments = (apiKey, debateSlug, page, sort, per_page, positionId, argumentId = null) => {
	const route = "/groups/" + debateSlug + "/messages?";
	if (sort === "position") {
		sort = null;
	}
	const query = {
		sort: sort,
		per_page: per_page,
		page: page,
	};
	if (positionId !== null) {
		query.position_id = positionId;
	}
	if (argumentId !== null) {
		query.argument_id = argumentId;
	}
	const queryString = new URLSearchParams(query).toString();
	return client_get(route + queryString, apiKey);
}

const getConsultation = (apiKey, consultationSlug) => {
	const route = "/consultations/" + consultationSlug;
	return client_get(route, apiKey);
}

const getPinnedGroup = (apiKey) => {
	const route = "/pinned_group";
	return client_get(route, apiKey);
}

const getSynthesis = (apiKey, sourceUid) => {
	const route = "/sources/" + sourceUid + "/synthesis";
	return client_get(route, apiKey);
}

const getSynthesisById = (apiKey, debateId) => {
	const route = "/groups/" + debateId + "/synthesis_by_id";
	return client_get(route, apiKey);
}

const getUser = (apiKey, userSlug) => {
	const route = "/users/" + userSlug;
	return client_get(route, apiKey);
}

const getSource = (apiKey, sourceUid) => {
	const route = "/sources/" + sourceUid;
	return client_get(route, apiKey);
}

const createSource = (apiKey, source) => {
	const route = "/sources";
	return client_post(route, source, apiKey);
}

const updateSource = (apiKey, uid, source) => {
	const route = "/sources/" + uid;
	const data = source;
	return client_patch(route, data, apiKey);
}

const getConsultationSynthesis = (apiKey, consultationId) => {
	const route = "/consultations/" + consultationId + "/synthesis";
	return client_get(route, apiKey);
}

const getArgument = (apiKey, argumentId) => {
	const route = "/messages/" + argumentId;
	return client_get(route, apiKey);
}

const getProposal = (apiKey, proposalId) => {
	const route = "/proposals/" + proposalId;
	return client_get(route, apiKey);
}

// BASE REQUESTS
const client_post = (route, data, apiKey) => {
	const url = apiURL + route;
	return new Promise((resolve, reject) => {
		httpClient
			.post(getClientToken(url, apiKey), data)
			.then((response) => {
				resolve(response);
			})
			.catch((err) => {
				reject(err);
			});
	});
}

const client_patch = (route, data, apiKey) => {
	const url = apiURL + route;
	return new Promise((resolve, reject) => {
		httpClient
			.patch(getClientToken(url, apiKey), data)
			.then((response) => {
				resolve(response);
			})
			.catch((err) => {
				reject(err);
			});
	});
}

const client_get = (route, apiKey) => {
	const url = apiURL + route;
	return new Promise((resolve, reject) => {
		httpClient
			.get(getClientToken(url, apiKey))
			.then((response) => {
				resolve(response);
			})
			.catch((err) => {
				reject(err);
			});
	});
}

// CLIENT TOKEN
const getClientToken = (url, apiKey) => {
	let urlParams = url.split("?")[1];
	if (urlParams) {
		return url + "&api_key=" + apiKey;
	} else {
		return url + "?api_key=" + apiKey;
	}
}


module.exports = {
	getList,
	getSettings,
	getDebate,
	getDebateByName,
	createDebate,
	getDebateArguments,
	getConsultation,
	getPinnedGroup,
	getSynthesis,
	getSynthesisById,
	getUser,
	getSource,
	updateSource,
	createSource,
	getArgument,
	getProposal,
	getConsultationSynthesis,
	getClientToken
};
