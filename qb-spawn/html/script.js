var Mainlocation = null
var MainspawnType = null

$(document).ready(function() {

    $(".container").hide();

    window.addEventListener('message', function(event) {
        var data = event.data;
        if (data.type === "ui") {
            if (data.status == true) {
                $(".container").fadeIn(250);
            } else {
                $(".container").fadeOut(250);
            }
        }

        if (data.action == "setupLocations") {
            setupNewLocations(data.locations, data.houses, data.Apartment, data.ApartmentNames, data.Access)
        }

        if (data.action == "setupAppartements") {
            setupApps(data.locations)
        }

        if (data.action == "AddCoord") {
            $(".AddBlipForMap").html("")

            $(".AddCoord").fadeIn(250);
            $("#VecX").val(data.Coord.x);
            $("#VecY").val(data.Coord.y);
            $("#VecZ").val(data.Coord.z);
            $("#VecH").val(data.Coord.h);

            $("#BlipTop").val(50);
            $("#BlipLeft").val(50);
            $('.AddBlipForMap').append('<i style="top:'+50+'%; left:'+50+'%;" id="BlipSetting" class="fas fa-map-marker-alt location-pin IconClassStyle"></i>')
        }
    })
})

$("#BlipTop").keyup(function(){
    var Top = this.value
    $("#BlipSetting").css({"top":Top+"%"});
});

$("#BlipLeft").keyup(function(){
    var Left = this.value
    $("#BlipSetting").css({"left":Left+"%"});
});

var SelectLocForSpawn = null
var apartNames = null
$(document).on('click', '#IconClassStyle', function(evt){
    evt.preventDefault();
    var location = $(this).data('location');
    var type = $(this).data('type');
    var label = $(this).data('label');
    if (type == "appartment2") {
        apartNames = $(this).data('apartname')
    }
    $(".TextFoJSCode").html("Select a Location")
    if (type !== "lab") {

        $.post('https://qb-spawn/setCam', JSON.stringify({
            posname: location,
            type: type,
        }));

        if(SelectLocForSpawn == null){
            SelectLocForSpawn = this
            Mainlocation = location
            MainspawnType = type
            $(this).addClass('selected');
            if(MainspawnType == "appartment"){
                $(".TextFoJSCode").html("Appartment: "+label)
            }else{
                $(".TextFoJSCode").html(label)
            }
        }else if(SelectLocForSpawn == this){
            $(this).removeClass("selected");
            if(MainspawnType == "appartment"){
                $(".TextFoJSCode").html("Select a Appartment")
            }else{
                $(".TextFoJSCode").html("Select a Location")
            }
            SelectLocForSpawn = null
            Mainlocation = null
            MainspawnType = null
            
        }else{
            $(SelectLocForSpawn).removeClass("selected");
            $(this).addClass('selected');
            Mainlocation = location
            MainspawnType = type
            SelectLocForSpawn = this
            if(MainspawnType == "appartment"){
                $(".TextFoJSCode").html("Appartment: "+label)
            }else{
                $(".TextFoJSCode").html(label)
            }
        }
    }
});

$(document).on('click', '.GreenBTN', function(evt){
    evt.preventDefault();

    if (Mainlocation !== null){
        $(".container").addClass("hideContainer").fadeOut("9000");
        setTimeout(function(){
            $(".hideContainer").removeClass("hideContainer");
        }, 900);

        $(SelectLocForSpawn).removeClass("selected");
        SelectLocForSpawn = null

        if (MainspawnType == "apartment1") {
            $.post('https://qb-spawn/spawnplayerappartment1', JSON.stringify({
                spawnloc: Mainlocation,
                apartName: apartNames,
            }));
        } else if(MainspawnType !== "appartment"){
            $.post('https://qb-spawn/spawnplayer', JSON.stringify({
                spawnloc: Mainlocation,
                typeLoc: MainspawnType
            }));
        }else {
            $.post('https://qb-spawn/chooseAppa', JSON.stringify({
                appType: Mainlocation,
            }));
        } 
    } else {
        console.log('Error: Not location selected')
    }

});

$(document).on('click', '.CloseBTN', function(evt){
    evt.preventDefault();
    CloseAddCoord()
});

function setupNewLocations(locations, myHouses, Apartment, ApartmentName, Access) {
    var parent = $('.spawn-locations-new')
    $(parent).html("");
    $('.dropdown-menu').html("");

    $(".RedBTN").fadeIn(1);
    $(".LastBTN").fadeIn(1);
    $(".TextFoJSCode").html('SPAWN <i style="color: black;" class="fas fa-map-marked-alt"></i>')

    $(".TextFoJSCode").html("Select a Location")
    Mainlocation = null
    MainspawnType = null
    if(SelectLocForSpawn !== null){
        $(SelectLocForSpawn).removeClass("selected");
        SelectLocForSpawn = null
    }

    if(Access.houses == false){
        $(".RedBTN").fadeOut(1);
    }
    if(Access.lastLoc == false){
        $(".LastBTN").fadeOut(1);
    }

    setTimeout(function(){
        if(Access.apartments == true){
            if(Apartment.pos !== undefined){
                $(parent).append('<i style="top:'+Apartment.pos.top+'%; left:'+Apartment.pos.left+'%;" data-location="'+Apartment.name+'" data-type="appartment2" data-label="'+Apartment.label+'" data-apartname="'+ApartmentName+'" id="IconClassStyle" class="fas fa-building IconClassStyle2"></i>')
            }
        }

        $.each(locations, function(index, location){
            $(parent).append('<i style="top:'+location.pos.top+'%; left:'+location.pos.left+'%;" data-location="'+location.location+'" data-type="normal" data-label="'+location.label+'" id="IconClassStyle" class="fas fa-map-marker-alt IconClassStyle"></i>')
        });

        if(Access.houses == true){
            if (myHouses != undefined) {
                $.each(myHouses, function(index, house){             
                    $(".dropdown-menu").append('<li id="IconClassStyle" data-location="'+house.house+'" data-type="house" data-label="'+house.label+'"><p><span id="'+house.house+'">'+house.label+'</span></p></li>');
                });
            }
        }

    }, 100)
}

function setupApps(apps) {
    var parent = $('.spawn-locations-new')
    $(parent).html("");

    $(".RedBTN").fadeOut(1);
    $(".LastBTN").fadeOut(1);
    $(".TextFoJSCode").html('SELECT <i style="color: black;" class="fas fa-check"></i>')

    $(".TextFoJSCode").html("Select a Appartment")
    Mainlocation = null
    MainspawnType = null
    if(SelectLocForSpawn !== null){
        $(SelectLocForSpawn).removeClass("selected");
        SelectLocForSpawn = null
    }

    $.each(apps, function(index, app){
        if(app.pos !== undefined){
            $(parent).append('<i style="top:'+app.pos.top+'%; left:'+app.pos.left+'%;" data-location="'+app.name+'" data-type="appartment" data-label="'+app.label+'" id="IconClassStyle" class="fas fa-building IconClassStyle2"></i>')
        }
    });
}

function CloseAddCoord() {
    $.post('https://qb-spawn/CloseAddCoord', JSON.stringify({}));
    $(".AddCoord").fadeOut(250);
}

const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};

$(document).on('click', '.ApartBTN', function(e){
    e.preventDefault();
    let source = '["'+$("#VecName").val()+'"] = {'+
                    'name = "'+$("#VecName").val()+'",'+
                    'label = "'+$("#VecLabel").val()+'",'+
                    'coords = {'+
                        'enter = vector4('+$("#VecX").val()+', '+$("#VecY").val()+', '+$("#VecZ").val()+', '+$("#VecH").val()+'),'+
                    '},'+
                    'pos = {top = '+$("#BlipTop").val()+', left = '+$("#BlipLeft").val()+'},'+
                '},';
    copyToClipboard(source)
    CloseAddCoord()
});

$(document).on('click', '.SpawnBTN', function(e){
    e.preventDefault();
    let source = '["'+$("#VecName").val()+'"] = {'+
                    'coords = vector4('+$("#VecX").val()+', '+$("#VecY").val()+', '+$("#VecZ").val()+', '+$("#VecH").val()+'),'+
                    'location = "'+$("#VecName").val()+'",'+
                    'label = "'+$("#VecLabel").val()+'",'+
                    'pos = {top = '+$("#BlipTop").val()+', left = '+$("#BlipLeft").val()+'},'+
                '},';
    copyToClipboard(source)
    CloseAddCoord()
});

$('.dropdown').click(function () {
    $(this).attr('tabindex', 1).focus();
    $(this).toggleClass('active');
    $(this).find('.dropdown-menu').slideToggle(300);
});

$('.dropdown').focusout(function () {
    $(this).removeClass('active');
    $(this).find('.dropdown-menu').slideUp(300);
});