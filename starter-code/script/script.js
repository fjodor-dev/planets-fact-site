$('document').ready(()=>{

    /*////////////////////////////////////////////////////////
    //              global variables declaretion            //
    ////////////////////////////////////////////////////////*/
    
      if(sessionStorage.getItem("planetNum") === null){
        sessionStorage.setItem("planetNum", 2)
      }
    
      let planetNum = sessionStorage.getItem("planetNum")
      let selectedView = 1
      let planetCount = 0
      let selectedColor
    
      let scalePlanets = true
      let showMoons = false
    
      let menuIsFoldedOut = false
    
      const biggestBodyKM = 69911 //jupiter, needed for scaling planets
      
      const cssRoot = $(":root")
    
      const menuIcon = $("header #menu_bar")
      const menuIconBar1 = $("header #menu_bar #bar1")
      const menuIconBar2 = $("header #menu_bar #bar2")
      const menuIconBar3 = $("header #menu_bar #bar3")
    
      const headerOl = $("header ol")
      const foldOutMenu = $("#fold_out_menu")
    
      const scaleSwitch = $(".scale_switch")
      const moonsSwitch = $(".moons_switch")
    
      const main = $("main")
    
      const planetSpace = $("main #planet_space")
      const chevron1 = planetSpace.children("#chevron1")
      const planet = planetSpace.children("#planet")
      const chevron2 = planetSpace.children("#chevron2")
      const planetToolTip = $("main  #planet_space #planet_surface_tooltip")
    
      const mainPlanetName = $("main article h1")
      const mainText = $("main article p")
      const source = $("main article h4 a")
    
      const viewOptions = main.children("#view_options")
    
      const detailsAPIData = $('#facts')
      const allMoons = $("#moons")
    
    /*////////////////////////////////////////////////////////
    //                   linear program flow                //
    ////////////////////////////////////////////////////////*/
    
      chevron1.finish().fadeOut(1200);
      chevron2.finish().fadeOut(1200);
    
      viewOptions.children().first().addClass("viewSelected")
      allMoons.slideUp(1)
      setData();
    
      $.getJSON("script/data.json", (data)=>{
    
        planetCount = data.length
        //forr all planets
        for (let index = (planetCount-1); index >= 0; index--) {
          //fill header list
          headerOl.prepend('<li id="'+ index +'"><h3>'+ data[index].name +'</h3></li>')
          // fill hamburger menu
          foldOutMenu.prepend('<div class="planet_li" id="'+ index +'"><img src="'+ data[index].images.planet + '" class="planet_icon"><h3>'+ data[index].name +'</h3><img class="chevron" src="assets/icon-chevron.svg" alt="chevron"></div>')
          foldOutMenu.children(".planet_li").last().children(".planet_icon").css( "background-image", 'url("'+ data[index].images.planet + '")')
        }
      })
    
    /*////////////////////////////////////////////////////////
    //                       event handlers                 //
    ////////////////////////////////////////////////////////*/
    
      menuIcon.on("click",()=>{
        
        if (menuIsFoldedOut) {
          //fold in
          menuIsFoldedOut = false
          main.show()
          foldOutMenu.finish().animate({"top": "-100vh"},300)
        }else{
          //fold out
          menuIsFoldedOut = true
          foldOutMenu.finish().animate({"top": "98px"},400,()=>{
            main.hide()
          })
        }
    
        
      })
      
      foldOutMenu.on("click",".planet_li",function(){
        planetNum = parseInt($(this).attr("id"))
        sessionStorage.setItem("planetNum", planetNum)
        setData()
    
        menuIsFoldedOut = false
        main.show()
        foldOutMenu.finish().animate({"top": "-100vh"},300)
    
      })
    
      $(".switch_holder").on("click",function(){
        $(this).toggleClass("selected_switch")
        // console.log($(this).attr("id"))
      })
    
      moonsSwitch.on("click",function(){
        showMoons = !showMoons
        allMoons.slideToggle()
        
      })
      $("#moonsH2").on("click",function(){
        showMoons = !showMoons
        allMoons.slideToggle()
        // $("#moonsH2").children("img").animate({ deg: 180 })
      })
    
      scaleSwitch.on("click",function(){
        scalePlanets = !scalePlanets
      })
    
      
    
    
      headerOl.on("click","li",function(){
        let prePlanet = planetNum
        // planet.css("background-color", "red")
        planetNum = parseInt($(this).attr("id"))
        sessionStorage.setItem("planetNum", planetNum)
        if(prePlanet < planetNum){
          swipePlanet(true)
        }
        else if(prePlanet > planetNum){
          swipePlanet(false)
        }else{
          setData()
        }
      })
    
      viewOptions.on("click",".view_setting",function(){
        viewOptions.children(".view_setting").removeClass("viewSelected")
        $(this).addClass("viewSelected")
        selectedView = parseInt($(this).attr("id"))
    
        setData();
      })
    
      planetSpace.on("mousemove",()=>{
        if(planetNum > 0){
          chevron1.finish().fadeIn(600);
        }else{
          chevron1.finish().fadeOut(300);
        }
        if(planetNum < planetCount-1){
          chevron2.finish().fadeIn(600);
        }else{
          chevron2.finish().fadeOut(300);
        }
      }).on("mouseleave",()=>{
        chevron1.finish().fadeOut(300);
        chevron2.finish().fadeOut(300);
      }).on("swiperight", ()=>{
        console.log("swipeR")
      }).on("swipeleft", ()=>{
        console.log("swipeL")
      })
    
      chevron1.on("click",()=>{
        if(planetNum > 0 ){
          planetNum--
          sessionStorage.setItem("planetNum", planetNum)
          swipePlanet(false)
          return
        }
        chevron1.css("height", "12%")
      })
      
      chevron2.on("click",()=>{
        if(planetNum < planetCount-1){
          planetNum++
          sessionStorage.setItem("planetNum", planetNum)
          swipePlanet(true)
          return
        }
        chevron1.css("height", "12%")
      })
    
      detailsAPIData.on('click', "#moons",function(){
            
        $("#moons").children(".foldOutData").finish().slideToggle()
    
      })
    
    /*////////////////////////////////////////////////////////
    //                   costum functions                   //
    ////////////////////////////////////////////////////////*/
    
      function swipePlanet(plus) {
    
        
        $(".swipingPlanet").remove()
        
    
        planetImageClone = planet.clone()
        planetImageClone.css("min-width", "0")
        
        planet.css("opacity", "0")
        
    
        // console.log(planetImage.css())
    
        planetImageClone.css({
          "position": "absolute",
          "width": planet.width() + "px",
          "height": planet.height() + "px",
        }).addClass("swipingPlanet")
    
        setData()
    
        planetSpace.append(planetImageClone)
    
    
        if(plus){
          planetImageClone.animate({left: (0-planetImageClone.width())},300,()=>{
            // setData() 
            planetImageClone
            .css({
              "height": planet.height() + "px",
              "width": planet.width() + "px",
              "left": 100 + "%"
            })
            .attr("src", "" + planet.attr("src"))
            .animate({left: planet.offset().left},300,()=>{
              planet.css("opacity", "1")
              $(".swipingPlanet").remove()
              
            })
          })
        }else{
          planetImageClone.animate({left: "100%"},300,()=>{
            // setData()
            planetImageClone
            .css({
              "height": planet.height() + "px",
              "width": planet.width() + "px",
              "left": (0-planet.width()) + "px"
            })
            .attr("src", "" + planet.attr("src"))
            .animate({left: planet.offset().left},300,()=>{
              planet.css("opacity", "1")
              $(".swipingPlanet").remove()
              
            })
          })
        }
        
      }
    
      function setData(){
        $.getJSON("script/data.json", (data)=>{
    
          selectedColor = data[planetNum].color
          
          cssRoot.css("--selectedColor", selectedColor)
    
          foldOutMenu.children(".planet_li").css("border-color", "var(--colorborder)")
          foldOutMenu.children(".planet_li:nth-child("+ (planetNum + 1) +")").css("border-color", "var(--selectedColor)")
    
          headerOl.children("li").css("border-color", "transparent")
          headerOl.children("li:nth-child("+ (planetNum + 1) +")").css("border-color", "var(--selectedColor)")
    
          mainPlanetName.text(data[planetNum].name)
    
          detailsAPIData.html("")
          setExtraAPIData(data[planetNum].name)
    
          planetToolTip.css("display","none").attr("src", data[planetNum].images.geology)
    
          if (scalePlanets) {
            let procent = 90
            if(data[planetNum].name == "Saturn"){//saturn sizing
              planet.height(((procent/100)*137.72455) + "%")
              planet.css("min-width", "unset")
            }else{
              procent *= (data[planetNum].radius/biggestBodyKM)
              planet.height(procent + "%")
              planet.css("min-width", procent + "%")
    
            }
          }
          
          switch (selectedView) {
            case 1:{
              mainText.text(data[planetNum].overview.content)
              source.attr("href", data[planetNum].overview.source)
              planet.attr("src", data[planetNum].images.planet)
            }break;
    
            case 2:{
              mainText.text(data[planetNum].structure.content)
              source.attr("href", data[planetNum].structure.source)
              planet.attr("src", data[planetNum].images.internal)
            }break;
    
            case 3:{
              mainText.text(data[planetNum].geology.content)
              source.attr("href", data[planetNum].geology.source)
              planet.attr("src", data[planetNum].images.planet)
              
              if(planetToolTip.css('display') == 'none'){
                planetToolTip.css("display","block").animate({"top": planet.position().top + ((planet.height()/100)*75)},300)
              }else{
                planetToolTip.css({"top": planet.position().top + ((planet.height()/100)*75),"display":"none"})
              }
            }break;
          }
    
          if (!scalePlanets) {
            planet.css({"width":"auto", "height": "auto","min-width":"auto", "min-height": "auto"})
          }
    
        })
      }
    
      function setExtraAPIData(name, element = detailsAPIData){
    
        $.ajax({url: "https://api.le-systeme-solaire.net/rest/bodies/" + name , success: function(data){
    
          const dataNotNeeded = [null,"", " ", "id", "name", "isPlanet", "bodyType"]
    
          for (const key in data) {
    
            if (dataNotNeeded.includes(data[key])||dataNotNeeded.includes(key)){
              continue
            }
    
            switch (key) {
    
              case "mass": setFact(`${data.mass.massValue} × 10<sup>${data.mass.massExponent}</sup> kg`,key)
                break;
              case "vol": setFact(`${data.vol.volValue} × 10<sup>${data.vol.volExponent}</sup> kg`, "volume")
                break;
    
              case "moons": {
    
                setFact(data[key].length,key)
    
                allMoons.html("")

                for (let index = 0; index < data.moons.length; index++) {
                  const id = data.moons[index].rel.split('/');
                  // console.log(id[id.length-1]);
                  
                  allMoons.append(
                    `<div class="fact moon" id="${id[id.length-1]}">
                    <h4>moon</h4>
                    <h2>${data.moons[index].moon}</h2>
                    </div>`
                  )
                }
    
              }
                break;
    
              case "escape": setFact(data[key] + " m/s",key)
                break;
    
              case "gravity": setFact(data[key] + " m/s<sup>2</sup>",key)
                break;
    
              case "avgTemp": setFact(data[key] + " k", "averageTempeture",key)
                break;
    
              case "sideralOrbit": setFact(data[key] + " days",key)
                break;
    
              case "sideralRotation": setFact(data[key] + " hours",key)
                break;
    
              case "density": setFact(data[key] + " g/cm<sup>3</sup>",key)
                break;
    
              case "mainAnomaly":
              case "inclination":
              case "axialTilt": setFact(data[key] + "°",key)
                break;
    
              case "semimajorAxis":
              case "perihelion":
              case "aphelion":
              case "flattening":
              case "polarRadius": 
              case "meanRadius": setFact(data[key] + "km",key)
                break;
    
              case "equaRadius": setFact(data[key] + "km", "equaterRadius")
                break;
              default: setFact(data[key],key)
                break;
            }
    
            
           
          }
    
          function setFact(endValue, endkey) {
    
            detailsAPIData.append(
              `<div class="fact">
              <h4>${endkey.replace(/[A-Z]/g, ' $&').trim()}</h4>
              <h2>${endValue}</h2>
              </div>`
            )
    
          }
    
        }})
    
      }
    
    })