
$(document).ready(function() {
  console.log('app is on!');

var $evictions = $('#evictions');

// *************
// read all evictions
// *************

function evictionHandlebarsTemplate() {
  var source = $('#evictions-template').html();
  var template = Handlebars.compile(source);

  $.get('/api/evictions', {limit: 20}).success(function (eviction) {

    var evictionResult = eviction;
    var evictionHtml = template({ eviction: evictionResult });

    $evictions.append(evictionHtml);
  });
}

evictionHandlebarsTemplate();

// *************
// create notice by eviction id
// *************

$(document).ready(function() {
    $(".datepick").datepicker();
});

function getDate() {
  var result = new Date();
  return result.toString("yyyy-MM-dd hh:mm:ss tt");
}

$evictions.on('click', '.link', function (e) {
  e.preventDefault();

  var evictionsToHide = $(this).closest('.eviction');
  var id= $(this).parents().data('eviction-id');

  evictionsToHide.next('.eviction-details').show();

  $('html, body').animate({
        scrollTop: evictionsToHide.offset().top
    }, 500);
});

$evictions.on('click', '.add-notice', function (e) {
  e.preventDefault();
  handleNewNoticeSubmit();

  var id = $(this).data('eviction-id');

  $('#add-notice-modal').data('eviction-id', id);
  $('#add-notice-modal').modal();
});

function handleNewNoticeSubmit(e) {
  $('#save-notice').on('click', function (e) {
    $( this ).off(e);
    var evictionId = $('#add-notice-modal').data('eviction-id');
    var formData = $('form.add').serialize() + "&notice_date=" + getDate() + "&eviction_id=" + evictionId + "";

    $.post('/api/notices', formData)
      .success(function(notice) {
      console.log('notice after POST', notice);
      
      var source = $('#notices-template').html();
      var template = Handlebars.compile(source);
      var noticeHtml = template(notice);

      $('.eviction-details[data-eviction-id=' + notice.eviction_id + ']').after(noticeHtml);
    });

    $('form.add')[0].reset();
    $('#add-notice-modal').modal('hide');
  });
}

// *************
// update notice
// *************

$evictions.on('click', '.edit-notice', function(e) {
  e.preventDefault();
  handleUpdateNoticeSubmit();

  var evictionId = $(this).data('eviction-id');
  var id = $(this).data('id');

  $('#update-notice-modal').data('eviction-id', evictionId);
  $('#update-notice-modal').data('id', id);
  $('#update-notice-modal').modal();
});

function handleUpdateNoticeSubmit(e) {
  $('#update-notice').on('click', function(e) {
    $( this ).off(e);

    var noticeId = $('#update-notice-modal').data('id');
    var formData = $('form.update').serialize() + "&_id=" + noticeId + "";

    $.ajax({
      url: '/api/notices/' + noticeId,
      method: 'PUT',
      data: formData,
      success: function update(notice) {
        $('#notices').data('id',notice._id).remove();

        var source = $('#notices-template').html();
        var template = Handlebars.compile(source);
        var noticeHtml = template(notice);
        $('.eviction-details[data-eviction-id=' + notice.eviction_id + ']').after(noticeHtml);
      }
    });

    $('form.update')[0].reset();
    $('#update-notice-modal').modal('hide');
  });
}

// *************
// delete notice
// *************

$evictions.on('click', '.delete-notice', function(e) {
  var id= $(this).data('id');
  console.log('id',id);
  $.ajax({
    url: '/api/notices/' + id,
    method: 'DELETE',
    success: function destroy(notice) {
      console.log('notice after DELETE', notice);
      $('#notices').data('id',id).remove();
    }
  });
});

// *************
// render notices by eviction id
// *************

function noticeHandlebarsTemplate() {
  var source = $('#notices-template').html();
  var template = Handlebars.compile(source);

  $.get('/api/notices').success(function (notices) {

    notices.forEach(function sortNoticeByEvictionId(notice) {
      var id = notice.eviction_id;
      var noticeHtml = template(notice);

      $('.eviction-details[data-eviction-id=' + id + ']').after(noticeHtml);
    });
  });
}

noticeHandlebarsTemplate();

// #########################
// SPA Navigation
// #########################

$(".nav-tenants-rights").click(function() {
    $('html, body').animate({
        scrollTop: $(".tenants-rights").offset().top
    }, 500);
});

$(".nav-eviction-feed").click(function() {
    $('html, body').animate({
        scrollTop: $(".eviction-feed").offset().top
    }, 500);
});

$(".nav-view-map").click(function() {
    $('html, body').animate({
        scrollTop: $(".view-map").offset().top
    }, 500);
});

});