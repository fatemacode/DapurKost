document.querySelector(".logout a").addEventListener("click", function(e){

    if(!confirm("Yakin ingin logout?")){

        e.preventDefault();

    }

});
