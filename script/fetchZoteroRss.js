$(document).ready(function(){
  var page = 1;
  var startItem = 0;
  var paginate = 25;
  var lastItem = page * paginate;
  groupId = 520939;
  var rssurl = "https://api.zotero.org/groups/"+groupId+"/items/top?start="+ startItem +"&limit=" + lastItem + "&format=atom&v=1";

  function fetchData(rssurl, page, startItem, lastItem, paginate) {
    $.get(rssurl, function(data) {
      console.log(rssurl)
      var xml = $(data);
      $("#list img").remove();
      if (xml.find("entry").length) {
        xml.find("entry").each(function() {
          var date = new Date($(this).find("published").text());
          var now = new Date();
          var difference = now - date;
          item = {
              title: $(this).find("title").text().trim(),
              link: $(this).find("content").find("tr.url > td").text().trim().replace(/\/$/, ""),
              description: $(this).find("content").find("tr.abstractNote > td").text(),
              date: date.toDateString(),
              user: $(this).find("name").text(),
              id: $(this).find("id").text()
          }
          if(item.link.length > 1) {
            $("#list").append("<h3><a href=" + item.link + ">" + item.title + "</a> <small style='white-space:nowrap;'>" + item.date + "</small></h3><p>Added by " + item.user + "</p><p> " + item.description + "</p>");
          } else {
            $("#list").append("<h3><a href=" + item.id + ">" + item.title + "</a> <small style='white-space:nowrap;'>" + item.date + "</small></h3><p>Added by " + item.user + "</p><p> " + item.description + "</p>");
          }
          if(difference < 864000000) {
            if(item.link.length > 1) {
              $("#digest").append("<p>" + item.title + " - " + item.link + "</p>");
            } else {
              $("#digest").append("<p>" + item.title + " - " + item.id + "</p>");
            }
          }
        });
      } else {
        $("#list").append("<h3 class='text-center'>There's nothing here (yet)</h3><img class='center-block' src='img/loading.gif'></img>");
      }
      if (xml.find("entry").length == paginate*page) {
        $("#list").append("<button data-page="+page+" data-startItem="+startItem+" data-lastItem="+lastItem+" data-paginate="+paginate+" class='loadNext btn btn-default center-block'>read more</button>");
      }
    });
  }

  fetchData(rssurl, page, startItem, lastItem, paginate);

  $(document).on("click", "button.loadNext", function() {
    $("button.loadNext").remove();
    $("#list").append("<img class='center-block' src='img/loading.gif'></img>");
    var page = parseInt($(this).attr("data-page"))+1;
    var startItem = parseInt($(this).attr("data-startItem"))+parseInt($(this).attr("data-paginate"));
    var lastItem = parseInt($(this).attr("data-lastItem"))+parseInt($(this).attr("data-paginate"));
    var rssurl = "https://api.zotero.org/groups/"+groupId+"/items/top?start="+ startItem +"&limit=" + lastItem + "&format=atom&v=1";
    fetchData(rssurl, page, startItem, lastItem, paginate);
  });

});
