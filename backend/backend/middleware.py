# middleware.py
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth.decorators import user_passes_test
from django.utils.deprecation import MiddlewareMixin

class AdminAccessMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # Protège les routes du dashboard
        if request.path.startswith('/dashboard/'):
            if not request.user.is_authenticated or not request.user.is_staff:
                return HttpResponseRedirect(reverse('admin:login'))
        return None