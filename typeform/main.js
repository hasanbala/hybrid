class Form {
  constructor() {
    this.swiper = new Swiper(".swiper-container", {
      direction: "vertical",
      resistanceRatio: 0,
      allowTouchMove: 0,
      on: {
        slideChangeTransitionEnd: () => {
          document.querySelector(".swiper-slide-active .form-item")?.focus();
        },
      },
    });
    this.loader = document.querySelector(".loader");
    this.blur = document.querySelector(
      ".swiper-slide-active fieldset:valid .form-item"
    );
    // document.addEventListener("keyup", this.handleKeyup);
  }

  // handleKeyup = (e) => {
  //   if (e.key === "Enter") {
  //     document
  //       .querySelector(".swiper-slide-active fieldset:valid + .next-button")
  //       ?.click();
  //   }
  // };

  handleClick = () => {
    const trump = document.querySelector(".swiper-slide-next");
    if (trump?.length > 0) {
      this.swiper.slideNext();
      this.blur?.blur();
    } else {
      if (this.steps[this.current].hasOwnProperty("beforeNext")) {
        this.steps[this.current].beforeNext();
      } else {
        this.next();
      }
    }
  };

  steps = [];
  current = 0;
  letters = ["a", "b", "c", "d", "e", "f"];
  formData = [];

  showLoader() {
    this.loader.classList.toggle("active");
  }

  next() {
    if (this.steps[this.current + 1]) {
      this.current += 1;
      this.generate(this.steps[this.current]);
      // [...document.querySelectorAll(".form-item:checked")].forEach((item) =>
      //   this.formData.push({ item: item.value })
      // );
      // [document.querySelector("input")].forEach((item) =>
      //   this.formData.push({ [item]: item.value })
      // );
    } else {
      this.callback();
    }
  }

  step(step, after = false) {
    if (after) {
      this.steps = [
        ...this.steps.slice(0, this.current + 1),
        step,
        ...this.steps.slice(this.current + 1),
      ];
    } else {
      this.steps.push(step);
    }
    return this;
  }

  value(input) {
    let currentStep = this.steps[this.current],
      temp;
    if (currentStep.type === "radio") {
      temp = document.querySelector(
        ".swiper-slide-active .form-item:checked"
      ).value;
    } else {
      temp = document.querySelector(".swiper-slide-active .form-item").value;
    }
    return temp === input.toString();
  }

  input(step) {
    return ` 
        <input 
          class="form-item"
          type="text"
          name="${step.name}"
          ${step.autofocus ? "autofocus" : ""} 
          ${step.required ? "required" : ""} 
          placeholder = "${step.placeholder}"
        /> 
      `;
  }

  file(step) {
    return `
        <label class="upload-file">
          <input type="file" name="${step.name}"
          ${step.required ? "required" : ""}  
          ${step.accept ? "accept=" + step.accept + "" : ""}>
          <span class="text" data-invalid= ${
            step.invalid ? step.invalid : "Click for choose the folder"
          }
          data-valid=${
            step.valid ? step.valid : "Choosed the folder successfully"
          }></span>
        </label>
      `;
  }

  textarea(step) {
    return ` 
        <textare ${step.required ? "required" : ""} 
        placeholder = "${step.placeholder}"
          name="${step.name}" class="form-item"
          cols="30" rows="5" > 
        </textare>
      `;
  }

  select(step) {
    let html = `<select 
      class="form-item"
      ${step.required ? "required" : ""} 
      ${step.autofocus ? "autofocus" : ""} 
      name="${step.name}"> <option value="">Choose</option>`;

    for (const property in step.values) {
      html += `<option >${step.values[property]}</option>`;
    }
    html += "</select>";
    return html;
  }

  radio(step) {
    let html = "";
    let i = 0;
    for (const property in step.values) {
      html += `
        <label class="radio">
          <input class="form-item" type="radio"
          ${step.required ? "required" : ""}
          name="${step.name}" value="${step.values[property]}">
          <span class="text">
            <span class="key">${this.letters[i].toUpperCase()}</span>
            ${step.values[property]}
          </span>
        </label>
        `;
      i++;
    }
    html += "</select>";
    return html;
  }

  generate(step) {
    // console.log(this.steps);
    if (!step.hasOwnProperty("type")) {
      step.type = "input";
    }
    if (!step.hasOwnProperty("placeholder")) {
      step.placeholder = "Your answer right here..";
    }
    let field = this[step.type](step);
    let template = document.querySelector("#slide-template").innerHTML;
    template = template
      .replace("{field}", field)
      .replace("{title}", step.title);
    this.swiper.appendSlide(template);
    console.log(this.steps);

    if (this.current > 0) {
      this.swiper.slideNext();
      this.blur?.blur();
      // [...document.querySelectorAll(".form-item:checked")].forEach((item) =>
      //   this.formData.push({ item: item.value })
      // );
      // [...document.querySelectorAll("input")].forEach((item) =>
      //   this.formData.push({ item: item.value })
      // );
    }

    [...document.querySelectorAll(".next-button")].forEach((button) => {
      button.addEventListener("click", this.handleClick);
    });
  }

  start() {
    this.generate(this.steps[this.current]);
  }

  end(callback) {
    this.callback = callback;
  }

  submit(callback) {
    callback();
  }
}

const form = new Form();

form
  .step({
    name: "name",
    title: "enter a name",
    required: true,
  })
  .step({
    name: "surname",
    title: "enter a surname",
    required: true,
  })
  .step({
    name: "photo",
    title: "upload a photo",
    type: "file",
    invalid: "invalid",
    valid: "valid",
    accept: "image/*",
    required: true,
  })
  .step({
    name: "site",
    title: "Which of the following apps do you use?",
    type: "radio",
    values: {
      "youtube.com": "Youtube",
      "instagram.com": "Instagram",
      "twitter.com": "Twitter",
      "tiktok.com": "Tiktok",
      "spotify.com": "Spotify",
      "other.com": "Others",
    },
    required: true,
    beforeNext: () => {
      if (form.value("Others")) {
        form.step(
          {
            name: "other_url",
            title: "Could you explain the app you use?",
            type: "input",
            required: true,
          },
          true
        );
      }
      form.next();
    },
  })
  .step({
    name: "gender",
    title: "choose your gender",
    type: "select",
    values: {
      1: "Man",
      2: "Woman",
    },
    required: true,
    beforeNext: () => {
      if (form.value("other.com")) {
        form.step(
          {
            name: "description",
            title: "Could you explain the app you use?",
            type: "textarea",
            required: true,
          },
          true
        );
      }
      form.next();
    },
  });

form.end(() => {
  form.submit(() => {
    console.log(form.formData);
  });
});

form.start();

//sass --watch main.scss:main.css --style compressed
