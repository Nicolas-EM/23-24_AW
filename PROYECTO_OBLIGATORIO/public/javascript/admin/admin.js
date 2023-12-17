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

$('div[data-bs-toggle="pill"]').on('shown.bs.tab', event => {
    if(event.target.id === "pills-users-tab"){
        createUserFacultyFilters();
    }
    else if (event.target.id === "pills-installations-tab") {
        getInstallations();
    } else if (event.target.id === "pills-faculties-tab") {
        getFaculties();
    } else if (event.target.id === "pills-stats-tab") {
        getStatsByFaculty();
        getStatsByUser();
    } else if(event.target.id === "pills-reservations-tab") {
        setReservationsSearch();
    }
});