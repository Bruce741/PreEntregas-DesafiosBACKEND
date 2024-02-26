document.getElementById("form").addEventListener("submit", function(event) {
    event.preventDefault();
    
    // Validar el nombre de usuario
    let Input = document.getElementById("input");
    if (Input.value === "") {
        Input.textContent = "Por favor ingrese un nombre de usuario";
        return;
    } 
    this.submit();
});