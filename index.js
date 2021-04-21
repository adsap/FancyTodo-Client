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
    },
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
            <a href="#" class="btn btn-warning">Edit</a>
            <a href="#" class="btn btn-danger">Delete</a>
          </div>
        </div>
        `);
      });
    })
    .fail((err) => {
      const { errors } = err.responseJSON;
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

