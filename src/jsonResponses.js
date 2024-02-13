const users = {};

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(object);
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const getUsers = (request, response) => {
  const responseJSON = { users };

  respondJSON(request, response, 200, JSON.stringify(responseJSON));
};

const getUsersMeta = (request, response) => {
  respondJSONMeta(request, response, 200);
};

const notReal = (request, response) => {
  const responseJSON = { message: 'The page you are looking for was not found!', id: 'notFound' };

  respondJSON(request, response, 404, JSON.stringify(responseJSON));
};

const notRealMeta = (request, response) => {
  respondJSONMeta(request, response, 404);
};

const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'Name and age are both required!',
  };

  if (!body.name || !body.age) {
    responseJSON.id = 'addUserMissingParams';
    return respondJSON(request, response, 400, JSON.stringify(responseJSON));
  }

  let responseCode = 204;

  if (!users[body.name]) {
    responseCode = 201;
    users[body.name] = {};
  }

  users[body.name].name = body.name;
  users[body.name].age = body.age;

  if (responseCode === 204) {
    return respondJSONMeta(request, response, 204);
  }

  return respondJSON(request, response, 201, JSON.stringify(users[body.name]));
};

module.exports = {
  getUsers,
  getUsersMeta,
  notReal,
  notRealMeta,
  addUser,
};
