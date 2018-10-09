module.exports.home = function ({ csrfToken }){
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Upload Files</title>
    </head>
    <body>
      <form action="/upload" method="post" enctype="multipart/form-data">
        <label for="file"> Insert file (be sure to send a file of less than 4 MB) :</label>
        <input name="avatar" type="file" id="avatar">
        <input type="hidden" name="_csrf" value="${csrfToken}">
        <button type="submit" value="valider" name="button">Send</button>
      </form>
    </body>
    </html>
  `
}