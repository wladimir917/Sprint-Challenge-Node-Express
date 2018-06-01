const express = require('express');
const cors = require('cors');
const projects = require('./data/helpers/projectModel');
const actions = require('./data/helpers/actionModel');
const port = 5000;

const server = express();
server.use(express.json());
server.use(cors({}));

const sendUserError = (status, message, res) => {
  res.status(status).json({ error: message });
};

// ===================== CUSTOM MIDDLEWARE =====================

const requiredCheckMiddleware = (req, res, next) => {
  const { name, description } = req.body;
  if (!name || !description) {
    sendUserError(404, 'Name and description must be included', res);
  } else {
    next();
  }
};

// ===================== PROJECT ENDPOINTS =====================

server.get('/api/projects', (req, res) => {
    projects
    .get()
    .then(foundProjects => {
      res.json(foundProjects);
    })
    .catch(err => {
      return sendUserError(500, 'The projects information could not be retrieved.', res);
    });
});

server.post('/api/projects', requiredCheckMiddleware, (req, res) => {
  const { name, description } = req.body;
  projects
    .insert({ name, description })
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      return sendUserError(500, 'The projects information could not be saved.', res);
    });
});

server.get('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  projects
    .get(id)
    .then(project => {
      res.json(project);
    })
    .catch(err => {
      return sendUserError(500, 'The projects information could not be retrieved.', res);
    });
});

server.get('/api/projects/:projectId/actions', (req, res) => {
  const { projectId } = req.params;
  projects
    .getProjectActions(projectId)
    .then(projectActions => {
      res.json(projectActions);
    })
    .catch(err => {
      return sendUserError(500, 'The projects information could not be retrieved.', res);
    });
});

server.delete('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  projects
    .remove(id)
    .then(projectRemoved => {
      if (!projectRemoved) {
        return sendUserError(404, 'No project by that id');
      }
        res.json({ success: 'Project Removed' });
    })
    .catch(err => {
      return sendUserError(500, 'The projects information could not be removed.', res);
    });
});

server.put('/api/projects/:id', requiredCheckMiddleware, (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  projects
    .update(id, { name, description })
    .then(project => {
      if (project === null ) {
        console.log(project === null)
        return sendUserError(404, 'No project by that id');
      }
        res.json(project);
    })
    .catch(err => {
      return sendUserError(500, 'The projects information could not be updated.', res);
    });
});


server.listen(port, () => console.log(`Server listening on ${port}`));