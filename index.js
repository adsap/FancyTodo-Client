$(document).ready(() => {
  checkIsLoggedIn();

  $('#navRegister').click((e) => {
    e.preventDefault();
    $('#login').hide();
    $('#register').show();
    $('#todoList').hide();
    $('#inputEmailRegister').val("")
    $('#inputPasswordRegister').val("");
  });

  $('#signup').click((e) => {
    e.preventDefault();
    $('#login').hide();
    $('#register').show();
    $('#todoList').hide();
    $('#inputEmailRegister').val("")
    $('#inputPasswordRegister').val("");
  });

  $('#signin').click((e) => {
    e.preventDefault();
    $('#login').show();
    $('#register').hide();
    $('#todoList').hide();
    $('#inputEmailLogin').val("")
    $('#inputPasswordLogin').val("");
  });

  $('#navLogin').click((e) => {
    e.preventDefault();
    $('#login').show();
    $('#register').hide();
    $('#todoList').hide();
    $('#inputEmailLogin').val("")
    $('#inputPasswordLogin').val("");
  });

  $('#navLogout').click((e) => {
    e.preventDefault();
    logout();
    signOut();
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

  $('#show-password-login').click(function() {
    if ($(this).is(':checked')){
     $('#inputPasswordLogin').attr('type','text');
    } else {
     $('#inputPasswordLogin').attr('type','password');
    }
  });

   $('#show-password-register').click(function() {
    if ($(this).is(':checked')){
     $('#inputPasswordRegister').attr('type','text');
    } else {
     $('#inputPasswordRegister').attr('type','password');
    }
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
    $('#inputEmailRegister').val("")
    $('#inputPasswordRegister').val("");
    $('#inputEmailLogin').val("")
    $('#inputPasswordLogin').val("");

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
      Toastify({
        text: "Successfully Login",
        duration: 2000,
        backgroundColor: "#07bc0c",
      }).showToast();
    })
    .fail((err) => {
      const errors = err.responseJSON.errorMessages;
      swal("Failed to login", errors.join(', '), "error");
    })
    .always(() => {
      checkIsLoggedIn();
      $('#add').hide();
    });
};

const logout = () => {
  localStorage.removeItem('access_token');
  checkIsLoggedIn();
  Toastify({
    text: "Successfully Logout",
    duration: 2000,
    backgroundColor: "#3498db",
  }).showToast();
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
        let todoDate = new Date(todo.due_date)
        $('#todoList').append(`
        <div class="card text-center mt-3 mb-3 mx-auto" id="todosCard">
          <div class="card-header" style="background-color: teal;" id="heading${todo.id}">
            <h2 class="mb-0">
              <button class="btn btn-link collapsed text-white" type="button" data-toggle="collapse" data-target="#collapse${todo.id}" aria-expanded="false" aria-controls="collapse${todo.id}">
              ${todo.title}
              </button>
            </h2>
          </div>
      
          <div id="collapse${todo.id}" class="collapse" aria-labelledby="heading${todo.id}" data-parent="#todoList">
            <div class="card-body text-center mx-auto" style="width: 18rem;">
              <p>${todo.status}<button type="button" class="btn" onClick="getStatusTodo(${todo.id})"><i class="fas fa-pencil-alt"></i></button></p>
              <p><i class="far fa-calendar-alt"></i> ${todoDate.toISOString().replace(/T.*/,'').split('-').reverse().join('-')}</p>
              <button type="button" class="btn btn-warning btn-sm rounded-pill" onClick="getEditTodo(${todo.id})" style="width: 70px">Edit</button>
              <button type="button" class="btn btn-dark btn-sm rounded-pill" onClick="viewTodo(${todo.id})" style="width: 70px">View</button>
              <button type="button" class="btn btn-danger btn-sm rounded-pill" onClick="getDeleteTodo(${todo.id})" style="width: 70px">Delete</button>
            </div>
          </div>
        </div>
        `);
      });
    })
    .fail((err) => {
      const errors = err.responseJSON.errorMessages;
      swal("Failed to show list todo", errors.join(', '), "error");
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
      checkIsLoggedIn();
      Toastify({
        text: "Registration Success",
        duration: 2000,
        backgroundColor: "#07bc0c",
      }).showToast();
    })
    .fail((err) => {
      const errors = err.responseJSON.errorMessages;
      swal("Failed to register user", errors.join(', '), "error");
    })
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
      Toastify({
        text: "Successfully add new todo",
        duration: 2000,
        backgroundColor: "#07bc0c",
      }).showToast();
    })
    .fail((err) => {
      const errors = err.responseJSON.errorMessages;
      swal("Failed to add todo", errors.join(', '), "error");
      $('#btn-add-todo').hide();
      $('#todoList').hide();
      $('#add').show();
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
      const errors = err.responseJSON.errorMessages;
      swal("Failed to show data todo", errors.join(', '), "error");
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
      Toastify({
        text: "Successfully update todo",
        duration: 2000,
        backgroundColor: "#f1c40f",
      }).showToast();
    })
    .fail((err) => {
      const errors = err.responseJSON.errorMessages;
      swal("Failed to update todo", errors.join(', '), "error");
      $('#todoList').hide();
      $('#edit').show();
      $('#btn-add-todo').hide();
    })
}

const getStatusTodo = (id) => {
  $.ajax({
    method: 'GET',
    url: `http://localhost:3000/todos/${id}`,
    headers: {
      access_token: localStorage.getItem('access_token'),
    }
  })
    .done((todo) => {
      localStorage.setItem('todo-id', id);
      $('#updateStatus').val(todo.data.status);
      $("#statusModal").modal('show');
    })
    .fail((err) => {
      const errors = err.responseJSON.errorMessages;
      swal("Failed to show status todo", errors.join(', '), "error");
    })
}

const updateStatusTodo = () => {
  const id = localStorage.getItem('todo-id')
  let status = $('#updateStatus').val();

  $.ajax({
    method: 'PATCH',
    url: `http://localhost:3000/todos/${id}`,
    headers: {
      access_token: localStorage.getItem('access_token'),
    },
    data: {
      status
    }
  })
    .done(() => {
      $("#statusModal").modal('hide');
      getTodos()
      Toastify({
        text: "Successfully change status todo",
        duration: 2000,
        backgroundColor: "#f1c40f",
      }).showToast();
    })
    .fail((err) => {
      const errors = err.responseJSON.errorMessages;
      swal("Failed to change status todo", errors.join(', '), "error");
    })
}

const viewTodo = (id) => {
  $.ajax({
    method: 'GET',
    url: `http://localhost:3000/todos/${id}`,
    headers: {
      access_token: localStorage.getItem('access_token'),
    }
  })
    .done((todo) => {
      let createdDate = new Date(todo.data.createdAt)
      let todoDate = new Date(todo.data.due_date)
      $('#viewCreatedDate').text(`Created Date : ${createdDate.toISOString().replace(/T.*/,'').split('-').reverse().join('-')}`);
      $('#viewTitle').text(`Title : ${todo.data.title}`);
      $('#viewDescription').text(`Description : ${todo.data.description}`);
      $('#viewStatus').text(`Status : ${todo.data.status}`);
      $('#viewDueDate').text(`Due Date : ${todoDate.toISOString().replace(/T.*/,'').split('-').reverse().join('-')}`);
      $("#todoModal").modal('show');
    })
    .fail((err) => {
      const errors = err.responseJSON.errorMessages;
      swal("Failed to view todo", errors.join(', '), "error");
    })
}

const getDeleteTodo = (id) => {
  $.ajax({
    method: 'GET',
    url: `http://localhost:3000/todos/${id}`,
    headers: {
      access_token: localStorage.getItem('access_token'),
    }
  })
    .done(() => {
      localStorage.setItem('todo-id', id);
      $("#deleteModal").modal('show');
    })
    .fail((err) => {
      const errors = err.responseJSON.errorMessages;
      swal("Failed to show todo", errors.join(', '), "error");
    })
}

const deleteTodo = () => {
  const id = localStorage.getItem('todo-id')
  $.ajax({
    method: 'DELETE',
    url: `http://localhost:3000/todos/${id}`,
    headers: {
      access_token: localStorage.getItem('access_token'),
    }
  })
    .done(() => {
      $("#deleteModal").modal('hide');
      getTodos()
      Toastify({
        text: "Succesfully delete todo",
        duration: 2000,
        backgroundColor: "#e74c3c",
      }).showToast();
    })
    .fail((err) => {
      const errors = err.responseJSON.errorMessages;
      swal("Failed to delete todo", errors.join(', '), "error");
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

function onSignUp(googleUser) {
  const id_token = googleUser.getAuthResponse().id_token;

  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/users/googleregister',
    data: {
      google_token: id_token
    }
  })
    .done((data) => {
      const { access_token } = data;
      localStorage.setItem('access_token', access_token);
      $('#inputEmailRegister').val("")
      $('#inputPasswordRegister').val("");
      checkIsLoggedIn();
      Toastify({
        text: "Successfully Sign up with Google",
        duration: 2000,
        backgroundColor: "#07bc0c",
      }).showToast();
    })
    .fail((err) => {
      const errors = err.responseJSON.errorMessages;
      swal("Registration Failed", errors.join(', '), "error");
    })
}

function onSignIn(googleUser) {
  const id_token = googleUser.getAuthResponse().id_token;

  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/users/googlelogin',
    data: {
      google_token: id_token
    }
  })
    .done((data) => {
      const { access_token } = data;
      localStorage.setItem('access_token', access_token);
      $('#inputEmailLogin').val("")
      $('#inputPasswordLogin').val("");
      Toastify({
        text: "Successfully Sign in with Google",
        duration: 2000,
        backgroundColor: "#07bc0c",
      }).showToast();
    })
    .fail((err) => {
      const errors = err.responseJSON.errorMessages;
      swal("Google login failed", errors.join(', '), "error");
    })
    .always(() => {
      checkIsLoggedIn();
      $('#add').hide();
    });
}

function signOut() {
  let auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
}

