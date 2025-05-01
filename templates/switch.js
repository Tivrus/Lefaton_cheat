// Получаем переключатель и палитру
const toggle = document.getElementById('settings-toggle');
const palette = document.getElementById('palette');
const colorScheme = document.getElementById('color-picker-panel')
// Обработчик изменения состояния переключателя
toggle.addEventListener('change', function() {
    // Если переключатель включен, показываем палитру, если выключен — скрываем
    if (this.checked) {
        palette.style.display = 'none';
        colorScheme.style.display = 'block';
    } else {
        palette.style.display = 'flex';
        colorScheme.style.display = 'none';
    }
});

// Функция изменения фона
function changeBackgroundColor(color) {
    document.body.style.backgroundColor = color;
}
