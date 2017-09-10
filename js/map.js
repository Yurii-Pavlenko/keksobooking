'use strict';
(function () {
  var KEY_ENTER = 13;
  var KEY_ESCAPE = 27;
  var dialogClose = window.card.mainDialog.querySelector('.dialog__close');
  var mainPin = document.querySelector('.pin__main');
  var MAIN_PIN_WIDTH = 75;
  var MAIN_PIN_HEIGHT = 70;
  var minPositionX = window.data.locationXmin - Math.floor(MAIN_PIN_WIDTH / 2);
  var maxPositionX = window.data.locationXmax + Math.floor(MAIN_PIN_WIDTH / 2);
  var minPositionY = window.data.locationYmin + MAIN_PIN_HEIGHT;
  var maxPositionY = window.data.locationYmax + MAIN_PIN_HEIGHT;

  var onLoadSuccess = function (data) {
    window.map.similarAdverts = data;
  };

  var mapWithPins = window.pin.createPins(window.map.similarAdverts);

  window.backend.load(onLoadSuccess, window.backend.onLoadError);

  var hideDialog = function (dialog) {
    dialog.classList.add('hidden');
  };

  var removePanel = function () {
    hideDialog(window.card.mainDialog);
    window.pin.removePinActive();
  };

  var onEnterButtonPush = function (evt) {
    if (evt.keyCode === KEY_ENTER) {
      window.pin.activateDialog(evt);
    }
  };

  var onCrossClick = function () {
    removePanel();
  };

  var onEscButtonPush = function (evt) {
    if (evt.keyCode === KEY_ESCAPE) {
      removePanel();
    }
  };

  var onMainPinMouseDown = function (downEvt) {
    downEvt.preventDefault();
    var startCoords = {
      x: downEvt.clientX,
      y: downEvt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };
      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      var positionX = mainPin.offsetLeft - shift.x;
      var positionY = mainPin.offsetTop - shift.y;

      mainPin.style.left = positionX + 'px';
      mainPin.style.top = positionY + 'px';

      if (positionX <= minPositionX) {
        mainPin.style.left = minPositionX + 'px';
      }
      if (positionX >= maxPositionX) {
        mainPin.style.left = maxPositionX + 'px';
      }
      if (positionY <= minPositionY) {
        mainPin.style.top = minPositionY + 'px';
      }
      if (positionY >= maxPositionY) {
        mainPin.style.top = maxPositionY + 'px';
      }

      window.form.address.value = (positionX + Math.floor(MAIN_PIN_WIDTH / 2)) + ', ' + (positionY + MAIN_PIN_HEIGHT);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  mapWithPins.addEventListener('keydown', onEnterButtonPush);
  mapWithPins.addEventListener('keydown', onEscButtonPush);
  dialogClose.addEventListener('click', onCrossClick);

  mainPin.addEventListener('mousedown', onMainPinMouseDown);

  window.map = {
    similarAdverts: [],
  };
})();
