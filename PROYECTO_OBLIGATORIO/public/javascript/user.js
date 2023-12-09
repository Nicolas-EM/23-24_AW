"use strict";

// LLamada AJAX para actualizar imagen perfil
$("#imageUpload").on("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  let fileType = file.type;

  if (fileType.startsWith("image/")) {
    console.log(file);
    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("_csrf", $("#csrfToken").val());

    console.log(formData);

    $.ajax({
      method: "POST",
      url: "/users/image",
      data: formData,
      processData: false,
      contentType: false,
      success: function (data) {
        $("#toastMsg").html(data);
        toast.show();

        // Actualizar imagen perfil
        const reader = new FileReader();
        reader.onload = function (e) {
          // get loaded data and render thumbnail.
          $("#userImg").attr("src", e.target.result);
        };
        // read the image file as a data URL.
        reader.readAsDataURL(file);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#toastMsg").html(jqXHR.responseText);
        toast.show();
      },
    });
  }
});