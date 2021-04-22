$(document).ready(() => {
  checkIsLoggedIn();

  $('#navRegister').click((e) => {
    e.preventDefault();
    $('#login').hide();
    $('#register').show();
    $('#todoList').hide();
  });

  $('#navLogin').click((e) => {
    e.preventDefault();
    $('#login').show();
    $('#register').hide();
    $('#todoList').hide();
  });

  $('#navLogout').click((e) => {
    e.preventDefault();
    logout();
  });

  $('#formLogin').on('submit', (e) => {
    e.preventDefault();
    login();
  });

  $('#formRegister').on('submit', (e) => {
    e.preventDefault();
    register();
  });

  $('#btn-add-todo').click((e) => {
    e.preventDefault();
    $('#btn-add-todo').hide();
    $('#todoList').hide();
    $('#add').show();
  });

  $('#formAddTodo').on('submit', (e) => {
    e.preventDefault();
    addTodo();
    $('#btn-add-todo').show();
    $('#todoList').show();
    $('#add').hide();
  });

  $('#formEditTodo').on('submit', (e) => {
    e.preventDefault();
    editTodo();
    $('#btn-add-todo').show();
    $('#todoList').show();
    $('#edit').hide();
  });


})

const checkIsLoggedIn = () => {
  if (localStorage.getItem('access_token')) {
    $('#navLogin').hide();
    $('#navLogout').show();
    $('#navRegister').hide();
    $('#btn-add-todo').show();

    $('#login').hide();
    $('#register').hide();
    $('#todoList').show();

    getTodos();
  } else {
    $('#navLogin').show();
    $('#navLogout').hide();
    $('#navRegister').show();

    $('#login').show();
    $('#register').hide();
    $('#todoList').hide();
    $('#btn-add-todo').hide();
    $('#add').hide();
    $('#edit').hide();

    clearTodos();
  }
};

const login = () => {
  let email = $('#inputEmailLogin').val();
  let password = $('#inputPasswordLogin').val();

  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/users/login',
    data: {
      email,
      password,
    }
  })
    .done((data) => {
      const { access_token } = data;
      localStorage.setItem('access_token', access_token);
      $('#inputEmailLogin').val("")
      $('#inputPasswordLogin').val("");
    })
    .fail((err) => {
      const { errors } = err.responseJSON;
    })
    .always(() => {
      checkIsLoggedIn();
      $('#add').hide();
    });
};

const logout = () => {
  localStorage.removeItem('access_token');
  checkIsLoggedIn();
};

const getTodos = () => {
  $.ajax({
    method: 'GET',
    url: 'http://localhost:3000/todos',
    headers: {
      access_token: localStorage.getItem('access_token'),
    }
  })
    .done((todos) => {
      $('#todoList').empty();
      todos.data.forEach((todo) => {
        $('#todoList').append(`
        <div class="card text-center mt-3 mx-auto" style="width: 18rem">
          <div class="card-body">
            <h5 class="card-title">${todo.title}</h5>
            <p class="card-text">
              ${todo.description}
            </p>
            <button type="button" class="btn btn-warning" onClick="getEditTodo(${todo.id})">Edit</button>
            <button type="button" class="btn btn-danger" onClick="deleteTodo(${todo.id})">Delete</button>
          </div>
        </div>
        `);
      });
    })
    .fail((err) => {
      const { errors } = err.responseJSON;
    })
    .always(() => {
      $('#add').hide();
      $('#edit').hide();
    });
};

const clearTodos = () => {
  $('#todoList').empty();
};

const register = () => {
  let email = $('#inputEmailRegister').val();
  let password = $('#inputPasswordRegister').val();

  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/users/register',
    data: {
      email,
      password,
    }
  })
    .done(() => {
      $('#inputEmailRegister').val("")
      $('#inputPasswordRegister').val("");
    })
    .fail((err) => {
      const { errors } = err.responseJSON;
    })
    .always(() => {
      checkIsLoggedIn();
    });
}

const addTodo = () => {
  let title = $('#inputTitle').val();
  let description = $('#inputDescription').val();
  let status = $('#inputStatus').val();
  let due_date = $('#inputDueDate').val();

  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/todos',
    headers: {
      access_token: localStorage.getItem('access_token'),
    },
    data: {
      title,
      description,
      status,
      due_date
    }
  })
    .done(() => {
      $('#inputTitle').val("");
      $('#inputDescription').val("");
      $('#inputStatus').val("");
      $('#inputDueDate').val("");
      getTodos()
    })
    .fail((err) => {
      const { errors } = err.responseJSON;
    })
}

const getEditTodo = (id) => {
  $.ajax({
    method: 'GET',
    url: `http://localhost:3000/todos/${id}`,
    headers: {
      access_token: localStorage.getItem('access_token'),
    }
  })
    .done((todo) => {
      localStorage.setItem('todo-id', id);
      let todoDate = new Date(todo.data.due_date)
      $('#editTitle').val(todo.data.title);
      $('#editDescription').val(todo.data.description);
      $('#editStatus').val(todo.data.status);
      $('#editDueDate').val(todoDate.toISOString().split('T')[0]);
      $('#todoList').hide();
      $('#edit').show();
      $('#btn-add-todo').hide();
    })
    .fail((err) => {
      const { errors } = err.responseJSON;
    })
}

const editTodo = () => {
  const id = localStorage.getItem('todo-id')
  let title = $('#editTitle').val();
  let description = $('#editDescription').val();
  let status = $('#editStatus').val();
  let due_date = $('#editDueDate').val();

  $.ajax({
    method: 'PUT',
    url: `http://localhost:3000/todos/${id}`,
    headers: {
      access_token: localStorage.getItem('access_token'),
    },
    data: {
      title,
      description,
      status,
      due_date
    }
  })
    .done(() => {
      $('#editTitle').val("");
      $('#editDescription').val("");
      $('#editStatus').val("");
      $('#editDueDate').val("");
      getTodos()
    })
    .fail((err) => {
      const { errors } = err.responseJSON;
    })
}

const deleteTodo = (id) => {
  $.ajax({
    method: 'DELETE',
    url: `http://localhost:3000/todos/${id}`,
    headers: {
      access_token: localStorage.getItem('access_token'),
    }
  })
    .done(() => {
      getTodos()
    })
    .fail((err) => {
      const { errors } = err.responseJSON;
    })
}

const cancel = () => {
  $('#inputTitle').val("");
  $('#inputDescription').val("");
  $('#inputStatus').val("");
  $('#inputDueDate').val("");
  $('#editTitle').val("");
  $('#editDescription').val("");
  $('#editStatus').val("");
  $('#editDueDate').val("");
  $('#btn-add-todo').show();
  $('#todoList').show();
  $('#add').hide();
  $('#edit').hide();
  getTodos()
}

