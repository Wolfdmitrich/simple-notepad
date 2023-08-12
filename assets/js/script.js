const setCookie = (name, value, days, attributes) => {
  let attr = [];
  let name_value = name + "=" + encodeURIComponent(value);
  attr.push(name_value);

  if (typeof days === "number") {
    let expires = new Date(Date.now() + 864e5 * days).toUTCString();
    attr.push("expires=" + expires);
  }

  if (typeof attributes === "object") {
    for (let attribute_name in attributes) {
      if (attribute_name === "path" || attribute_name === "domain") {
        attr.push(attribute_name + "=" + attributes[attribute_name]);
      }
    }
  }

  return (document.cookie = attr.join("; "));
};

const getCookie = (key) => {
  let cookies = document.cookie.split("; ");
  let cookies_list_obj = {};

  for (let i = 0; i < cookies.length; i++) {
    let name_value = cookies[i].split("=");
    let name = name_value[0];
    let value = decodeURIComponent(name_value[1]);
    cookies_list_obj[name] = value;

    if (key === name) {
      return value;
    }
  }

  if (key !== undefined) {
    return null;
  } else {
    return cookies_list_obj;
  }
};

const removeCookie = (name, attributes) => {
  attributes = attributes || {};
  attributes.expires = new Date(0).toUTCString();
  setCookie(name, "", undefined, attributes);
};

var app = new Vue({
  el: "#app",
  data: {
    value: "",
    saveData: "",
    loadData: "",
    clearData: "",
  },
  methods: {
    save: function () {
      try {
        if (this.value.trim() === "") {
          this.saveData = "Текст не может быть пустым";
        } else {
          setCookie("value", this.value, 30);
          this.saveData = "Сохранение произошло успешно";
        }
      } catch (error) {
        this.saveData = `Произошла ошибка при сохранении: ${error.message}`;
      }
    },
    load: function () {
      try {
        if (getCookie("value") === null || getCookie("value") === "") {
          this.loadData = "До загрузки не было сохранений";
        } else {
          this.value = getCookie("value") || "";
          this.loadData = "Загрузка произошла успешно";
        }
      } catch (error) {
        this.loadData = `Произошла ошибка при загрузке: ${error.message}`;
      }
    },

    clear: function () {
      try {
        if (getCookie("value") === null || getCookie("value") === "") {
          this.clearData = "Нечего очищать: сохранений не было";
        } else {
          removeCookie("value");
          this.clearData = "Очистка произошла успешно";
        }
      } catch (error) {
        this.clearData = `Произошла ошибка при очистке: ${error.message}`;
      }
    },
  },
});
