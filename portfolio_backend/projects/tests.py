from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase

from .models import CV, Profile, Project


def tiny_png(name='test.png'):
	return SimpleUploadedFile(
		name,
		bytes.fromhex(
			'89504E470D0A1A0A0000000D49484452000000010000000108060000001F15C489'
			'0000000A49444154789C6300010000050001'
			'0D0A2DB40000000049454E44AE426082'
		),
		content_type='image/png',
	)


class PortfolioApiTests(TestCase):
	@classmethod
	def setUpTestData(cls):
		cls.project = Project.objects.create(
			title='Test Project',
			slug='test-project',
			category='web',
			short_description='A test project for API coverage.',
			full_description='Detailed description for the test project.',
			technologies='Django, DRF, PostgreSQL',
			thumbnail=tiny_png('project.png'),
			order=99,
			is_featured=True,
		)
		cls.profile = Profile.objects.create(
			name='Test Developer',
			title='Backend Developer',
			profile_image=tiny_png('profile.png'),
			bio='Testing bio',
			is_active=True,
		)
		cls.cv = CV.objects.create(
			file=SimpleUploadedFile('resume.pdf', b'%PDF-1.4\n%test pdf\n', content_type='application/pdf'),
			is_active=True,
		)

	def test_projects_list_includes_saved_project(self):
		response = self.client.get('/api/projects/')
		self.assertEqual(response.status_code, 200)
		slugs = [item['slug'] for item in response.json()]
		self.assertIn('test-project', slugs)

	def test_profile_endpoint_returns_uploaded_image(self):
		response = self.client.get('/api/profile/')
		self.assertEqual(response.status_code, 200)
		data = response.json()
		self.assertEqual(data['name'], 'Test Developer')
		self.assertIn('/media/profile/', data['profile_image'])

	def test_cv_endpoint_returns_uploaded_file(self):
		response = self.client.get('/api/cv/')
		self.assertEqual(response.status_code, 200)
		data = response.json()
		self.assertIn('/media/cv/', data['file'])

	def test_contact_endpoint_creates_message(self):
		response = self.client.post(
			'/api/contact/',
			data={
				'name': 'Visitor',
				'email': 'visitor@example.com',
				'subject': 'Hello',
				'message': 'Testing the contact form.',
			},
			content_type='application/json',
		)
		self.assertEqual(response.status_code, 201)
		self.assertEqual(response.json()['success'], True)
