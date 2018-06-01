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
       sendUserError(500, 'The projects information could not be retrieved.', res);
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
       sendUserError(500, 'The projects information could not be saved.', res);
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
       sendUserError(500, 'The projects information could not be retrieved.', res);
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
       sendUserError(500, 'The projects information could not be retrieved.', res);
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
       sendUserError(500, 'The projects information could not be removed.', res);
    });
});

server.put('/api/projects/:id', requiredCheckMiddleware, (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  projects
    .update(id, { name, description })
    .then(project => {
      if (project === null ) {
        return sendUserError(404, 'No project by that id');
      }
        res.json(project);
    })
    .catch(err => {
         sendUserError(500, 'The projects information could not be updated.', res);
    });
});

// ===================== ACTIONS ENDPOINTS =====================

server.get('/api/actions', (req, res) => {
    actions.get()
        .then( actionsList => {
            res.json(actionsList)
        })
        .catch( error => {
             sendUserError(500, 'The actions information could not be retrieved.', res);
        })
})

server.get('/api/actions/:id', (req, res) => {
    const { id } = req.params
    actions.get(id)
        .then( action => {
            res.json(action)
        })
        .catch( error => {
            sendUserError(500, 'The actions information could not be retrieved.', res);
        })
})

server.post('/api/projects/:id/actions', (req, res) => {
    const { id } = req.params
    const { description, notes } = req.body
    if (!description) {
        sendUserError(404, 'Description must be included', res);

    } else {
        let result = null
        if (notes !== undefined) {
            result = actions.insert({
                project_id: id,
                description: description,
                notes: notes,
                completed: completed
            })
         } else {
            result = actions.insert({
                project_id: id,
                description: description,
                notes: '',
                completed: completed
            })
        }
            result.then( action => {
                res.json(action)
            })
            .catch( error => {
                sendUserError(500, 'The actions information could not be retrieved.', res);
            })
    }
})

server.delete('/api/actions/:id', (req, res) => {
    const { id } = req.params
    actions.remove(id)
        .then( response => {
            if (response) {
                actions.get()
                    .then( actionsList => {
                        res.json(actionsList)
                    })
                    .catch( error => {
                        sendUserError(500, 'The actions information could not be retrieved.', res);
                    })
            } else {
                sendUserError(404, 'The actions information could not be deleted.', res);
            }
        })
        .catch ( error => {
            sendUserError(500, 'The actions information could not be retrieved.', res);
        })
})

server.put('/api/actions/:id', (req, res) => {
    const { id } = req.params
    const { description, notes, completed } = req.body
    if (!description) {
        sendUserError(404, 'Description must be included', res);        
    } else {
        let result = null
        if (notes) {
            result = actions.update( id, {
                description: description,
                notes: notes,
                completed: completed
            })
         } else {
            result = actions.update(id, {
                description: description,
                notes: '',
                completed: completed
            })
        }
            result.then( action => {
                res.json(action)
            })
            .catch( error => {
                sendUserError(500, 'The actions information could not be retrieved.', res);
            })
    }
})

server.listen(port, () => console.log(`Server listening on ${port}`));