from django.contrib import messages
from django.views.generic import TemplateView
from django_facebook.api import get_persistent_graph
from django_facebook.decorators import facebook_required


class Home(TemplateView):
    template_name = 'index.html'



@facebook_required(scope='publish_actions')
def post_like(request):
    fb = get_persistent_graph(request)
    entity_url = ''
    result = fb.set('me/tangler:like', item=entity_url)
    messages.info(request, 'msg')


@facebook_required(scope='publish_actions')
def post_design(request):
    fb = get_persistent_graph(request)
    entity_url = ''
    result = fb.set('me/tangler:design', item=entity_url)
    messages.info(request, 'msg')

