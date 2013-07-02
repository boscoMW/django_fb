from django.contrib import messages
from django.views.generic import TemplateView
from django_facebook.api import get_persistent_graph
from django_facebook.decorators import facebook_required
from django_facebook.utils import next_redirect


class Home(TemplateView):
    template_name = 'index.html'


class Tangle(TemplateView):
    template_name = 'tangle.html'


@facebook_required(scope='publish_actions')
def post_like(request):
    fb = get_persistent_graph(request)
    entity_url = 'http://dev.makeystreet.com/tangle/119/'
    fb.set('me/og.likes', object=entity_url)
    messages.info(request, 'you Liked a tangle')
    return next_redirect(request)


@facebook_required(scope='publish_actions')
def post_design(request):
    fb = get_persistent_graph(request)
    tangle = "http://immense-stream-9442.herokuapp.com/tangle/"
    fb.set('me/tangler:design', tangle=tangle)
    messages.info(request, 'you designed a tangle')
    return next_redirect(request)
