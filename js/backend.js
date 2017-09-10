'use strict';
(function () {
  var serverUrl = 'https://1510.dump.academy/keksobooking';

  var setup = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 10000;

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case 200:
          var errorNode = document.querySelector('.error-popup');
          if (errorNode !== null) {
            errorNode.remove();
          }
          onLoad(xhr.response);
          break;
        case 400:
          error = 'Неверный запрос';
          break;
        case 401:
          error = 'Пользователь не авторизован';
          break;
        case 404:
          error = 'Неверный адрес запроса';
          break;
        default:
          error = 'Неизвестный статус: ' + xhr.status + ' ' + xhr.statusText;
      }
      if (error) {
        onError(error);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Error: Connection unvaliable');
    });
    xhr.addEventListener('timeout', function () {
      onError('The query did not have time to execute for ' + xhr.timeout + 'msec');
    });
    return xhr;
  };
  window.backend = {
    load: function (onLoad, onError) {
      var xhr = setup(onLoad, onError);

      xhr.open('GET', serverUrl + '/data');
      xhr.send();
    },

    save: function (data, onLoad, onError) {
      var xhr = setup(onLoad, onError);

      xhr.open('POST', serverUrl);
      xhr.send(data);
    },

    onLoadError: function (errorMessage) {
      var onCloseButtonClick = function () {
        document.body.removeChild(errorDiv);

        closeButton.removeEventListener('click', onCloseButtonClick);
      };

      var onCloseButtonKeyDown = function (evt) {
        if (evt.keyCode === 13) {
          document.body.removeChild(errorDiv);

          closeButton.removeEventListener('keydown', onCloseButtonClick);
        }
      };

      var errorDiv = document.createElement('div');
      errorDiv.classList.add('error-message');
      errorDiv.textContent = errorMessage;

      var closeButton = document.createElement('button');
      closeButton.classList.add('error-message__button');

      closeButton.addEventListener('click', onCloseButtonClick);
      closeButton.addEventListener('keydown', onCloseButtonKeyDown, onCloseButtonClick);

      errorDiv.appendChild(closeButton);
      document.body.appendChild(errorDiv);
    }
  };
})();