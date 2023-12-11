// Rotate arrow on collapse show
$(".collapse").on('show.bs.collapse', e => {
    // Find the closest element with class 'dropdown-arrow' and remove the 'rotated' class
    $(e.target)
        .closest('.nav-item')
        .find('.dropdown-arrow')
        .removeClass('rotated');
});

// Rotate arrow on collapse hide
$(".collapse").on('hide.bs.collapse', e => {
    // Find the closest element with class 'dropdown-arrow' and remove the 'rotated' class
    $(e.target)
        .closest('.nav-item')
        .find('.dropdown-arrow')
        .addClass('rotated');
});

$('button[data-bs-toggle="pill"]').on('shown.bs.tab', event => {
    //   event.target // newly activated tab
    //   event.relatedTarget // previous active tab

    console.log(event.target.id);

    if(event.target.id === "pills-users-tab"){
        createFacultyFilters();
    }
    else if (event.target.id === "pills-installations-tab") {
        getInstallations();
    } else if (event.target.id === "pills-faculties-tab") {
        getFaculties();
    } else if (event.target.id === "pills-stats-tab") {
        getStatsByFaculty();
        getStatsByUser();
    } else {
        console.error("Not implemented");
    }
});