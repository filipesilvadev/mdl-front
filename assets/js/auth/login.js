const form = document.getElementById("kt_sign_in_form");

var validator = FormValidation.formValidation(form, {
    fields: {
        email: {
            validators: {
                emailAddress: {
                    message: "O valor informado não é um email válido.",
                },
                notEmpty: {
                    message: "O campo é obrigatório.",
                },
            },
        },
        password: {
            validators: {
                notEmpty: {
                    message: "O campo é obrigatório.",
                },
                stringLength: {
                    min: 8,
                    message: "O campo precisa ter mais de 8 caracteres",
                },
            },
        },
    },
    plugins: {
        trigger: new FormValidation.plugins.Trigger(),
        bootstrap: new FormValidation.plugins.Bootstrap5({
            rowSelector: ".fv-row",
            eleInvalidClass: "",
            eleValidClass: "",
        }),
    },
});

const submitButton = document.getElementById("kt_sign_in_submit");
submitButton.addEventListener("click", function (e) {
    e.preventDefault();

    if (validator) {
        validator.validate().then(function (status) {
            console.log("validated!");

            if (status == "Valid") {
                submitButton.setAttribute("data-kt-indicator", "on");
                submitButton.disabled = true;
                form.submit();
            }
        });
    }
});

