    
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
            message: "�O�������"
          }, // Email �O�������
          email: true // �ݭn�ŦX email �榡
        },
        "�K�X": {
          presence: {
            message: "�O�������"
          }, // �K�X�O�������
          length: {
            minimum: 5, // ���פj�� ��
            maximum: 12, // ���פp�� 12
            message: "^�K�X���׻ݤj�� 5 �p�� 12"
          },
        },
        "�T�{�K�X": {  
          presence: {
            message: "�O�������"
          },// �T�{�K�X�O�������
          equality: {
            attribute: "password",// �����n�M�K�X���@��
            message: "^�K�X���ۦP"
          }
        },
        "�ϥΪ̦W��": {
          presence: {
            message: "�O�������"
          }, // ����ϥΪ̦W��
          length: {
            minimum: 3, // �W�٪��׭n�W�L 3 
          },
          format: {
            pattern: "[a-z0-9]+", // �u���J�^��μƦr
            flags: "i",// �j�p�g����
            message: "�u��]�t a-z �M 0-9"
          }
        },
        '�ͤ�': {
           presence: {
            message: "�O�������"
          }, // �ͤ����O����
           date: {
            latest: moment().subtract(18, "years"), // �~�ֺ� 18
            message: "^�W�L 18 ���~�i�H�ϥγo�ӪA�Ȯ@��"
          }
        },
        "�Ҧb�a": {
          presence: {
            message: "�O�������"
          }, // �Ҧb�a������
          inclusion: {
            within: ["KS"],  // �u���b within ���~���ҳq�L
            message: "^Sorry, �o�ӪA�ȥu���ѵ�����"
          }
        },
        "�q��": {
          presence:{
            message: "�O�������"
          },
        },
      };

      // Hook up the form so we can prevent it from being posted
      var form = document.querySelector("form#main");
      form.addEventListener("submit", function(ev) {
        ev.preventDefault();
        handleFormSubmit(form);
      });
      
      // ��ť input �ȧ��ܪ����p
      var inputs = document.querySelectorAll("input, textarea, select")
      for (var i = 0; i < inputs.length; ++i) {
        inputs.item(i).addEventListener("change", function(ev) {
          var errors = validate(form, constraints) || {};
          showErrorsForInput(this, errors[this.name])
        });
      }

      // �S�����~�N��ܦ��\�ǰe
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