var KTAuthResetPassword = (function () {
    var t, e, i;
    return {
        init: function () {
            (t = document.querySelector("#kt_password_reset_form")),
                (e = document.querySelector("#kt_password_reset_submit")),
                (i = FormValidation.formValidation(t, {
                    fields: {
                        email: {
                            validators: {
                                regexp: {
                                    regexp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message:
                                        "O valor não é um endereço de e-mail válido", // Traduzido
                                },
                                notEmpty: {
                                    message:
                                        "O endereço de e-mail é obrigatório", // Traduzido
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
                })),
                e.addEventListener("click", function (r) {
                    r.preventDefault(),
                        i.validate().then(function (i) {
                            "Valid" == i
                                ? (e.setAttribute("data-kt-indicator", "on"),
                                  (e.disabled = !0),
                                  setTimeout(function () {
                                      e.removeAttribute("data-kt-indicator"),
                                          (e.disabled = !1),
                                          Swal.fire({
                                              text: "Enviamos um link de redefinição de senha para o seu e-mail.", // Traduzido
                                              icon: "success",
                                              buttonsStyling: !1,
                                              confirmButtonText: "Ok, entendi!", // Traduzido
                                              customClass: {
                                                  confirmButton:
                                                      "btn btn-primary",
                                              },
                                          }).then(function (e) {
                                              if (e.isConfirmed) {
                                                  t.querySelector(
                                                      '[name="email"]',
                                                  ).value = "";
                                                  var i = t.getAttribute(
                                                      "data-kt-redirect-url",
                                                  );
                                                  i && (location.href = i);
                                              }
                                          });
                                  }, 1500))
                                : Swal.fire({
                                      text: "Desculpe, parece que alguns erros foram detectados. Por favor, tente novamente.", // Traduzido
                                      icon: "error",
                                      buttonsStyling: !1,
                                      confirmButtonText: "Ok, entendi!", // Traduzido
                                      customClass: {
                                          confirmButton: "btn btn-primary",
                                      },
                                  });
                        });
                });
        },
    };
})();

KTUtil.onDOMContentLoaded(function () {
    KTAuthResetPassword.init();
});
