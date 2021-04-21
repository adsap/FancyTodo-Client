$(document).ready(() => {
  checkIsLoggedIn();

  $('#formLogin').on('submit', (e) => {
    e.preventDefault();
    login();
  });

  $('#navLogout').click((e) => {
    e.preventDefault();
    logout();
  });

})

const checkIsLoggedIn = () => {
  if (localStorage.getItem('access_token')) {
    $('#navLogin').hide();
    $('#navLogout').show();

    $('#login').hide();
    $('#todos').show();

    getTodos();
  } else {
    $('#navLogin').show();
    $('#navLogout').hide();

    $('#login').show();
    $('#register').hide();
    $('#todos').hide();

    clearTodos();
  }
};

const login = () => {
  const inputEmailLogin = $('#inputEmailLogin');
  const inputPasswordLogin = $('#inputPasswordLogin');

  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/users/login',
    data: {
      email: inputEmailLogin.val(),
      password: inputPasswordLogin.val(),
    },
  })
    .done((data) => {
      const { access_token } = data;
      localStorage.setItem('access_token', access_token);
      inputEmailLogin.val('');
      inputPasswordLogin.val('');
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
    .done((data) => {
      $('#todoList').empty();
      data.data.forEach((todo) => {
        $('#todoList').append(`
        <div class="card-header text-center bg-info text-black">
          Todos
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">${todo.title}</li>
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

