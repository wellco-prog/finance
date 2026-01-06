// Импортируем flatpickr
import flatpickr from "flatpickr";

// Импортируем стили
import "flatpickr/dist/flatpickr.min.css";

// Импортируем локализацию (русский)
import { Russian } from "flatpickr/dist/l10n/ru";

// Инициализация Flatpickr
export function initDatepickers() {
    // Базовый datepicker
    flatpickr("#date-input", {
        locale: Russian,
        dateFormat: "d.m.Y",
        altInput: true,
        altFormat: "d.m.Y",
        allowInput: true,
        placeholder: "Выберите дату",
        static: false // Календарь всегда виден
    });

    // Для поля с датой операции
    flatpickr("#operation-date", {
        locale: Russian,
        dateFormat: "d.m.Y",
        altInput: true,
        altFormat: "d.m.Y",
        allowInput: true,
        placeholder: "дд.мм.гггг",
        static: false,
        maxDate: "today", // Нельзя выбрать будущую дату
        onChange: function(selectedDates, dateStr, instance) {
            console.log("Выбрана дата:", dateStr);
        }
    });

    // Range picker (для выбора периода)
    flatpickr("#date-range", {
        locale: Russian,
        mode: "range",
        dateFormat: "d.m.Y",
        altInput: true,
        altFormat: "d.m.Y",
        placeholder: "Выберите период",
        static: false
    });

    // Time picker (дата + время)
    flatpickr("#datetime", {
        locale: Russian,
        enableTime: true,
        dateFormat: "d.m.Y H:i",
        altInput: true,
        altFormat: "d.m.Y H:i",
        time_24hr: true,
        placeholder: "дд.мм.гггг чч:мм"
    });
}