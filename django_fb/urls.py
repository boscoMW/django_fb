from core.views import Home
from django.conf.urls import patterns, include, url
from django.conf import settings
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', Home.as_view(), name='home'),
    url(r'^facebook/', include('django_facebook.urls')),
    url(r'^accounts/', include('django_facebook.auth_urls')),
    url(r'^admin/', include(admin.site.urls)),
)

urlpatterns += patterns(
    'django.contrib.auth.views',
    url(settings.LOGIN_URL[1:], 'login', name='login', kwargs={'template_name': 'login.html'}),
    url(settings.LOGOUT_URL[1:], 'logout_then_login', name='logout'),
)
