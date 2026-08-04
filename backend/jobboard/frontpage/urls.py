from rest_framework import routers
from .api import JobViewSet

router = routers.DefaultRouter()
router.register('api/job', JobViewSet, 'job')

urlpatterns = router.urls