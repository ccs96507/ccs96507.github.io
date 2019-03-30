    
	(function() {
      validate.extend(validate.validators.datetime, {
        parse: function(value, options) {
          return +moment.utc(value);
        },
        format: function(value, options) {
          var format = options.dateOnly ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm:ss";
          return moment.utc(value).format(format);
        }
      });
      var constraints = {
        "email": {  
          presence:  {
            message: "是必填的欄位"
          }, // Email 是必填欄位
          email: true // 需要符合 email 格式
        },
        "密碼": {
          presence: {
            message: "是必填的欄位"
          }, // 密碼是必填欄位
          length: {
            minimum: 5, // 長度大於 ５
            maximum: 12, // 長度小於 12
            message: "^密碼長度需大於 5 小於 12"
          },
        },
        "確認密碼": {  
          presence: {
            message: "是必填的欄位"
          },// 確認密碼是必填欄位
          equality: {
            attribute: "password",// 此欄位要和密碼欄位一樣
            message: "^密碼不相同"
          }
        },
        "使用者名稱": {
          presence: {
            message: "是必填的欄位"
          }, // 必填使用者名稱
          length: {
            minimum: 3, // 名稱長度要超過 3 
          },
          format: {
            pattern: "[a-z0-9]+", // 只能填入英文或數字
            flags: "i",// 大小寫不拘
            message: "只能包含 a-z 和 0-9"
          }
        },
        '生日': {
           presence: {
            message: "是必填的欄位"
          }, // 生日欄位是必填
           date: {
            latest: moment().subtract(18, "years"), // 年齡滿 18
            message: "^超過 18 歲才可以使用這個服務哦～"
          }
        },
        "所在地": {
          presence: {
            message: "是必填的欄位"
          }, // 所在地為必填
          inclusion: {
            within: ["KS"],  // 只有在 within 的才驗證通過
            message: "^Sorry, 這個服務只提供給高雄"
          }
        },
        "電話": {
          presence:{
            message: "是必填的欄位"
          },
        },
      };

      // Hook up the form so we can prevent it from being posted
      var form = document.querySelector("form#main");
      form.addEventListener("submit", function(ev) {
        ev.preventDefault();
        handleFormSubmit(form);
      });
      
      // 監聽 input 值改變的狀況
      var inputs = document.querySelectorAll("input, textarea, select")
      for (var i = 0; i < inputs.length; ++i) {
        inputs.item(i).addEventListener("change", function(ev) {
          var errors = validate(form, constraints) || {};
          showErrorsForInput(this, errors[this.name])
        });
      }

      // 沒有錯誤就顯示成功傳送
      function handleFormSubmit(form, input) {
        var errors = validate(form, constraints);// validate the form aainst the constraints
        showErrors(form, errors || {}); // then we update the form to reflect the results
        if (!errors) {
          showSuccess();
        }
      }

      // Updates the inputs with the validation errors
      function showErrors(form, errors) {
        // We loop through all the inputs and show the errors for that input
        _.each(form.querySelectorAll("input[name], select[name]"), function(input) {
          // Since the errors can be null if no errors were found we need to handle
          // that
          showErrorsForInput(input, errors && errors[input.name]);
        });
      }

      // Shows the errors for a specific input
      function showErrorsForInput(input, errors) {
        // This is the root of the input
        var formGroup = closestParent(input.parentNode, "form-group")
          // Find where the error messages will be insert into
          , messages = formGroup.querySelector(".messages");
        // First we remove any old messages and resets the classes
        resetFormGroup(formGroup);
        // If we have errors
        if (errors) {
          // we first mark the group has having errors
          formGroup.classList.add("has-error");
          // then we append all the errors
          _.each(errors, function(error) {
            addError(messages, error);
          });
        } else {
          // otherwise we simply mark it as success
          formGroup.classList.add("has-success");
        }
      }

      // Recusively finds the closest parent that has the specified class
      function closestParent(child, className) {
        if (!child || child == document) {
          return null;
        }
        if (child.classList.contains(className)) {
          return child;
        } else {
          return closestParent(child.parentNode, className);
        }
      }

      function resetFormGroup(formGroup) {
        // Remove the success and error classes
        formGroup.classList.remove("has-error");
        formGroup.classList.remove("has-success");
        // and remove any old messages
        _.each(formGroup.querySelectorAll(".help-block.error"), function(el) {
          el.parentNode.removeChild(el);
        });
      }

      // Adds the specified error with the following markup
      // <p class="help-block error">[message]</p>
      function addError(messages, error) {
        var block = document.createElement("p");
        block.classList.add("help-block");
        block.classList.add("error");
        block.innerText = error;
        console.log(block);
        messages.appendChild(block);
      }
      function showSuccess() {
        alert("Success!"); // We made it \:D/
      }
    })();