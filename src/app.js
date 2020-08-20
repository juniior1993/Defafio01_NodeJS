const {uuid, isUuid} = require("uuidv4");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
      id: uuid(),
      title,
      url,
      techs,
      likes: 0
  };
  repositories.push(repository);
  return response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  if(!isUuid(id)){
    return response.status(400).json({error: 'Invalid id'});
  }
  const indexRepository = repositories.findIndex(repository => repository.id === id);
  if(indexRepository < 0) {
      return response.status(400).json({error: 'Project not found'});
  }
  const {likes} = repositories[indexRepository]
  const newRepository = {
      id,
      title,
      url,
      techs,
      likes
  }
  repositories[indexRepository] = newRepository;
  return response.status(200).json(newRepository);

});

app.delete("/repositories/:id", (request, response) => {
    const { id } = request.params;

    if(!isUuid(id)){
        return response.status(400).json({error: 'Invalid id'});
    }
    const indexRepository = repositories.findIndex(repository => repository.id === id);
    if(indexRepository < 0 ) {
        return response.status(400).json({error: 'Project not found'});
    }
    repositories.splice(indexRepository, 1);
    return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
    const { id } = request.params;
    if(!isUuid(id)){
        return response.status(400).json({error: 'Invalid id'});
    }
    const indexRepository = repositories.findIndex(repository => repository.id === id);
    if(indexRepository < 0 ) {
        return response.status(400).json({error: 'Project not found'});
    }
    repositories[indexRepository].likes += 1;
    return response.status(200).json(repositories[indexRepository]);

});

module.exports = app;
