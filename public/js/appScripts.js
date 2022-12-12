// $ is jQuery

// This function runs code when the document loads (ready)
$(function() {
    $("#myTable").tablesorter()

    // # is the ID selector - chain on methods after
    // . is the class selector
    // $("ul") - selects all UL objects
    // $("#").method1().method2().method3()

    //? Sliders

    $( "#slider-length" ).slider({
        range: true,
        min: 30,
        max: 80,
        step: 5,
        values: [ 30, 80 ],
        slide: function( event, ui ) {
            $( "#filter_len_val" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] )
        },
        stop: function( event, ui) {
            ajaxThatTable();
        }
    })
    $( "#filter_len_val" ).val( $( "#slider-length" ).slider( "values", 0 ) + " - " + $( "#slider-length" ).slider( "values", 1 ) )

    $( "#slider-diameter" ).slider({
        range: true,
        min: 6.0,
        max: 10.2,
        step: 0.1,
        values: [ 6.0, 10.2 ],
        slide: function( event, ui ) {
            $( "#filter_dia_val" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] )
        },
        stop: function ( event, ui ) {
            ajaxThatTable();
        }
    })
    $( "#filter_dia_val" ).val( $( "#slider-diameter" ).slider( "values", 0 ) + " - " + $( "#slider-diameter" ).slider( "values", 1 ) )



    







    var $filterItems = $( ".filterItem" )
    var $filterAlls = $( ".filterAll" )
    var $filterLength = $( "#slider-length" )
    var $filterDiameter = $( "#slider-diameter" )
    const ajaxThatTable = function () {
        var brands = []
        var lengths = $filterLength.slider( "values" )
        var diameters = $filterDiameter.slider( "values" )
        //! Change to be data-value-id instead of label text - change on backend
        $filterItems.each( function () {   // Iterate through check items and build brands array
            if ($(this).is(":checked")) {
                brands.push($(this).next('label').text())
            }
        })
        //! will need to fix this later to only look at 'all' for section
        if ($filterAlls.is(':checked')) {
            $filterItems.each( function () {
                brands.push($(this).next('label').text())
            })
        }
        //! data structure - { b: [x,y,z], b_sort: 0, d: [min,max], d_sort: 0, etc..}
        //! figure out how to get this information to/from the address bar
        //!     .../products/rope/?=b=x,y,z&d=min,max&sort=diam&sort=-brand&page=2
        $.ajax({
            url: '/products/ropes',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ brand: brands, length: lengths, diameter: diameters }),
            success: (res) => {
                var tbodyElem = $('tbody')  // Cache DOM element
                tbodyElem.html('')  // Clear the table
                $('#entry-count').text(res.data.length + " Entries Found")  // Update entry count
                res.data.forEach( (entry) => {  // Add rows back to table
                tbodyElem.append('\
                    <tr>\
                        <td><input class="form-check-input" type="checkbox" /></td>\
                        <td><a href="/product/' + entry._id + '">' + entry.name + '</a></td>\
                        <td>' + entry.brand + '</td>\
                        <td>' + entry.diameter.toFixed(1) + '</td>\
                        <td>' + entry.length + '</td>\
                        <td>$' + entry.seller.totalPrice + '</td>\
                    </tr>\
                ')
                })
                $("#myTable").trigger("update") // Update table in tablesorter
            }
        })
    }

    //! create aggregation pipeline to find all possible values for checks and min/max for sliders
    //! set on first page load - ajax table after
    //! figure out "greying-out" filters later - for zero entries found(and populate numbers after filters)

    //  Removes checks from other fields in category
    $filterAlls.click( function() {
        $(this).prop("checked",true)    // Prevent unchecking 'all' by clicking on it
        $(this).closest("ul").find(".filterItem").prop("checked",false)
        ajaxThatTable()
    })

    // Handles check boxes 
    $filterItems.click( function() {
        $(this).closest("ul").find(".filterAll").prop("checked",true)   // Add check to add
        $filterItems.each( function () {    // Check if any item is checked
            if ($(this).is(':checked')) {
                $(this).closest("ul").find(".filterAll").prop("checked",false)  // remove 'checked' from 'all' check box
            }
        })
        ajaxThatTable()
    })
})