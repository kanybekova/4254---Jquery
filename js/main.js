let btnClose = $('.btn-close')
let mainModal = $('.main-modal')
let addBtn = $('.add-btn')
let title = $('.title')
let price = $('.price')
let description = $('.description')
let image = $('.image')
let addModal = $('.add-modal')
let page = 1
let pageCount = 1

function getPagination() {
    fetch('http://localhost:8000/clothes')
        .then(res => res.json())
        .then(data => {
            pageCount = Math.ceil(data.length / 4)
            $('.pagination-page').remove()
            for (let i = pageCount; i >= 1; i--) {
                console.log(i);
                $('.previous-btn').after(`<span class ="pagination-page">
                </span>`)
            }
        })
}
$('body').on('click', '.pagination-page', function (e) {
    page = e.target.innerText
    render()
})
render()

$('.add-btn').on('click', function () {
    if (!title.val().trim(), !price.val().trim(), !description.val().trim(), !image.val().trim()) {
        alert('Заполните поля!')
        return
    }
    let newClothes = {
        title: $('.title').val(),
        price: $('.price').val(),
        description: $('.description').val(),
        image: $('.image').val()
    }
    fetch('http://localhost:8000/clothes', {
        method: "POST",
        body: JSON.stringify(newClothes),
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then(() => render())
    $('.add-modal').css('display', 'none')
})

function render() {
    fetch(`http://localhost:8000/clothes?_page=${page}&_limit=4q`)
        .then(res => res.json())
        .then(clothesData => {
            getPagination()
            $('.block').html('')
            clothesData.forEach(item => {
                $('.block').append(`
                <div class="card" style="width: 18rem;">
                <img src="${item.image}" class="card-img-top" alt="...">
                <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <span class="card-price">${item.price}</span>
                        <p class="card-text">${item.description.slice(0, 100)}...</p>
                        <a href="#" id="${item.id}" class="edit-btn btn-secondary btn-lg">Edit</a>
                        <a href="#" id="${item.id}" class="btn-delete btn-secondary btn-lg">Delete</a>
                    </div>
                </div>
                `)
            })
        })
}

$('body').on('click', '.edit-btn', function (e) {
    let id = e.target.id
    fetch(`http://localhost:8000/clothes/${id}`)
        .then(res => res.json())
        .then(clothes => {
            $('.edit-title').val(clothes.title)
            $('.edit-price').val(clothes.price)
            $('.edit-description').val(clothes.description)
            $('.edit-image').val(clothes.image)
            $('main-modal').css('display', 'block')
        })
    $('.main-modal').css('display', 'block')
})

$('body').on('click', '.button', function (e) {
    let id = e.target.id
    fetch(`http://localhost:8000/clothes/${id}`, {
        method: 'PUT'
    })

    $('.add-modal').css('display', 'block')
        .then(res => res.json())
        .then(() => render())
})

$('body').on('click', '.btn-delete', function (e) {
    let id = e.target.id
    fetch(`http://localhost:8000/clothes/${id}`, {
        method: "DELETE"
    })
        .then((res) => res.json())
        .then(() => render())
    console.log(e);
})

$('.btn-close').on('click', function () {
    mainModal.css('display', 'none')
})

$('.btn-close').on('click', function () {
    addModal.css('display', 'none')
})

$('.btn-save').on('click', function (e) {
    let id = e.target.id
    let editValue1 = $('.title').val();
    let editValue2 = $('.price').val();
    let editValue3 = $('.description').val();
    let editValue4 = $('.image').val();
    let obj = {
        title: editValue1,
        price: editValue2,
        description: editValue3,
        image: editValue4
    }
    fetch(`http://localhost:8000/clothes/${id}`, {
        method: "PATCH",
        body: JSON.stringify(obj),
        headers: { 'Content-type': 'application/json' }
    })
        .then(() => {
            render()
            $('.main-modal').css('display', 'none')
        })
})

$('.next-btn').on('click', function () {
    if (page >= pageCount) return
    page++
    render()
})
$('.previous-btn').on('click', function () {
    if (page <= 1) return
    page--
    render()
})
render()