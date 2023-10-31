$('#calendar').daterangepicker({
    autoUpdateInput: false,
    locale: {
        cancelLabel: 'Clear'
    },
    "minDate": new Date(),
}, function (start, end, label) {
    console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
    //Handle price locally:
    // let days = start.diff(b,'days')+1;
    // console.log(days);
    // $('#precioTotal').text(($('#precioTotal').text()) * days);
    
});
