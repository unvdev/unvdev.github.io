fetch('/assets/images/about/gallery.json')
  .then(res => res.json())
  .then(files => {
    files.forEach(file => {
      const img = document.createElement('img');
      img.src = `/assets/images/about/${file}`;
      document.querySelector('#gallery').appendChild(img);
    });
  });//
