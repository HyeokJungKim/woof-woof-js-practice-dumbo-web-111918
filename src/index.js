document.addEventListener("DOMContentLoaded", () => {
  const dogBar = document.getElementById('dog-bar')
  const mainDogDiv = document.getElementById('dog-info')
  const goodDogButton = document.getElementById('good-dog-filter')

  const getAllDogs = () => {
    fetch("http://localhost:3000/pups")
    .then(res => res.json())
    .then(dogs => dogs.forEach(dog => {
      dogBar.append(renderDogSpan(dog))
    }))
  }

  const getGoodDogs = () => {
    fetch("http://localhost:3000/pups")
    .then(res => res.json())
    .then(dogs => {
      const goodDogs = dogs.filter((dog) => dog.isGoodDog)
      goodDogs.forEach(dog => {
        dogBar.append(renderDogSpan(dog))
      })
    })
  }

  const handleDogBar = (e) => {
    if (e.target.classList.contains("dog-name")) {
      const id = e.target.getAttribute("data-id")
      fetch(`http://localhost:3000/pups/${id}`)
      .then(res => res.json())
      .then(dog => {
        mainDogDiv.innerHTML = ""
        mainDogDiv.setAttribute("data-id", dog.id)
        mainDogDiv.append(renderMainDog(dog))
      })
    }
  }

  const handleFilter = (e) => {
    const isOn = e.target.innerText === "Filter good dogs: ON"
    e.target.innerText = isOn ? "Filter good dogs: OFF" : "Filter good dogs: ON"
    handleShow(isOn)
  }

  const handleShow = (boolean) => {
    dogBar.innerHTML = ""
    if (boolean) {
      getAllDogs()
    } else{
      getGoodDogs()
    }
  }

  const handleDogBoolean = (e) => {
    if (e.target.id === "button") {
      const futureGood = e.target.innerText === "Make Good Dog!"
      const id = e.target.parentElement.getAttribute("data-id")
      fetch(`http://localhost:3000/pups/${id}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({isGoodDog: futureGood})
      })
      .then(res => res.json())
      .then(dog => {
        dog.isGoodDog ? e.target.innerText = "Make Bad Dog!" : e.target.innerText = "Make Good Dog!"
        const isOn = goodDogButton.innerText === "Filter good dogs: OFF"
        handleShow(isOn)
      })
    }
  }

  getAllDogs()
  dogBar.addEventListener("click", handleDogBar)
  mainDogDiv.addEventListener("click", handleDogBoolean)
  goodDogButton.addEventListener("click", handleFilter)
})

const renderDogSpan = (dog) => {
  const span = document.createElement("span")
  span.classList.add("dog-name")
  span.innerText = dog.name
  span.setAttribute("data-id", dog.id)
  return span
}

const renderMainDog = (dog) => {
  const fragment = document.createDocumentFragment()
  const image = document.createElement("img")
  image.src = dog.image
  const h2 = document.createElement("h2")
  h2.innerText = dog.name
  const button = document.createElement("button")
  button.id = "button"
  button.innerText = dog.isGoodDog ? "Make Bad Dog!" : "Make Good Dog!"
  fragment.append(image, h2, button)
  return fragment
}
