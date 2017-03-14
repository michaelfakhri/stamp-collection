function initializeTable (table) {
  $(table).bootstrapTable('removeAll')
  $(table).bootstrapTable({
    columns: [{
      field: 'id',
      visible: false
    },{
      field: 'name',
      title: 'Stamp',
      align: 'center'
    }, {
      field: 'hops',
      title: '# of Hops',
      align: 'center'
    },  {
      field: 'country',
      title: 'Country Of Origin',
      align: 'center',
      visible: false
    }, {
      field: 'year',
      title: 'Year Of Origin',
      align: 'center',
      visible: false
    }, {
      field: 'download',
      title: 'Download',
      align: 'center'
    },  {
      field: 'view',
      title: 'View',
      align: 'center',
      visible: false
    }, {
      field: 'delete',
      title: 'Delete',
      align: 'center'
    }],
    uniqueId: 'id'
  });
}

function injectData () {
    let countries = ['US', 'Canada', 'Mexico', 'Unknown']
    for (var i = 0; i < 10; i++ ) {
      let request = new XMLHttpRequest()
      let url = 'https://unsplash.it/200/200/?random'
      request.open("GET", url, true);
      request.responseType = "arraybuffer";

      let image = i

      request.onload = function (oEvent) {
        var arrayBuffer = request.response;
        if (arrayBuffer) {
          var byteArray = new Uint8Array(arrayBuffer);
          node.publish(byteArray, {name:("Image "+Math.floor((Math.random() * 200) + 1)), country: countries[Math.floor(Math.random() * 3)], year:(2000 + image)})
        }
      };
      request.send(null)
    }
}

function display (imageData, name, year, country) {
  if($( "#serchDiv" )[0]) $( "#serchDiv" )[0].style.display = 'none'
  if($( "#localItems" )[0]) $( "#localItems" )[0].style.display = 'none'
  if($( "#searchResults" )[0]) $( "#searchResults" )[0].style.display = 'none'
  if($( "#viewDiv" )[0]) $( "#viewDiv" )[0].style.display = 'block'
  var arrayBufferView = new Uint8Array( imageData );
  var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
  var urlCreator = window.URL || window.webkitURL;
  var imageUrl = urlCreator.createObjectURL( blob );
  var img = $( "#photo" );
  img[0].style.display = 'block'
  img[0].src = imageUrl;
  $( "#name" )[0].innerHTML = name
  $( "#year" )[0].innerHTML = year
  $( "#country" )[0].innerHTML = country

}

function downloadImage (data, fileName) {
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  var arrayBufferView = new Uint8Array( data );
  var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
  var urlCreator = window.URL || window.webkitURL;
  var url = urlCreator.createObjectURL( blob );
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
}

function createStamp(e) {
  e.preventDefault()
  let metadata = {}
  metadata.name = $('#name_create')[0].value
  metadata.year = $('#year_create')[0].value
  metadata.country = $('#country_create')[0].value
  let file = $('#file_create')[0].files[0]
  let reader = new window.FileReader();
  reader.readAsArrayBuffer(file);
  reader.onload = function (e) {
    node.publish(e.target.result, metadata)
    $('#createForm')[0].reset()
  }
}
  function searchStamp(e) {
    e.preventDefault()
    let metadata = {}
    if ($('#name_search')[0].value) metadata.name = $('#name_search')[0].value
    if ($('#year_search')[0].value) metadata.year = parseInt($('#year_search')[0].value)
    if ($('#country_search')[0].value) metadata.country = $('#country_search')[0].value
    $('#searchDiv')[0].style.display = 'none'
    $('#searchForm')[0].reset()
    node.query(metadata).then((result) => {
      parseAndAppendData(result, "#table")
      $('#searchResults')[0].style.display = 'block'
    })
  }
  function parseAndAppendData (data, table) {
  let index = 0
    data.forEach((user) => {
        user.result.forEach((newData) => {
          let dataItem = newData
          dataItem.hops = user.hops
          dataItem.id = index
          if (user.id === 'local') {
            dataItem.delete = '<a href="javascript:void(0)" onclick= "node.delete(\''+dataItem.hash + '\').then(() =>$(\''+table+'\').bootstrapTable(\'removeByUniqueId\','+index+'))" >Delete</a>'
            dataItem.download = '<a href="javascript:void(0)" onclick= "node.view(\'' + dataItem.hash + '\').then((data) => downloadImage(data,\'' + dataItem.name + '\'));">Found Locally</a>'
            dataItem.name = '<a href="javascript:void(0)" onclick= "node.view(\''+dataItem.hash + '\').then((data) => display(data,\''+dataItem.name+'\',\''+dataItem.year+'\',\''+dataItem.country+'\')); return false;">'+dataItem.name+'</a>'

          } else {
            dataItem.delete = '-'
            dataItem.download = '<a href="javascript:void(0)" onclick="download_remote(\''+dataItem.hash+'\', \''+user.id+'\', \''+dataItem.name+'\');return false;">'+user.id+'</a>'
            dataItem.name = '<a href="javascript:void(0)" onclick=" view_remote(\''+dataItem.hash+'\', \''+user.id+'\', \''+dataItem.name+'\',\''+dataItem.year+'\',\''+dataItem.country+'\');return false;">'+dataItem.name+'</a>'
          }
          $(table).bootstrapTable('append', dataItem);
          index++
        })
    })
  }
  function initializeConnections() {
  $('#connectionsTable').bootstrapTable({
    columns: [{
      field: 'user',
      title: 'User Identity'
    },{
      field: 'disconnect',
      title: 'Disconnect'
    }],
    data: []
  });
  node.getConnectedPeers().forEach((userHash) => {
    let record = {}
    record.user = userHash
    record.disconnect = '<a href="javascript:void(0);" onclick="node.disconnect(\''+userHash + '\').then(() => refereshConnectionsTable()); return false;">Disconnect</a>'
    $('#connectionsTable').bootstrapTable('append', record);

  })
}
function refereshConnectionsTable() {
  $('#connectionsTable').bootstrapTable('removeAll')
  initializeConnections()
}

function download_remote (hash, user, name) {
  setImmediate(() => {
    node.connect(user)
      .then(() => node.copy(hash, user))
      .then(() => node.view(hash))
      .then((data) => downloadImage(data, name))
      .catch((err) => {
        throw err
      })
  })
  return false
}

function view_remote (hash, user, name, year, country) {
  setImmediate(() => {
    node.connect(user)
      .then(() => node.copy(hash, user))
      .then(() => node.view(hash))
      .then((data) => display(data, name, year, country))
      .catch((err) => {
        throw err
      })
  })
  return false
}
