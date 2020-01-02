import time
import random, string

# Selenium with Python - https://selenium-python.readthedocs.io/
from selenium import webdriver
from selenium.webdriver.common.by import By #.[ID|LINK_TEXT|NAME|CSS_SELECTOR|etc.]
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.keys import Keys

# TODO: verificar usu, distintos contenidos de consultas y acciones en ejes
main_page = "http://localhost:3000/"
admin_email = 'tkkksxgc@guerrillamail.info'
admin_pass = '123123'
# textos de menús (case-sensitive!)
ajustes_menu_texts = {
	'perfil': 'PERFIL',
	'contraseña': 'CONTRASEÑA',
	'notificaciones': 'NOTIFICACIONES',
	'gestion_de_usuarios': 'GESTIÓN DE USUARIOS',
	'consultas': 'CONSULTAS',
}
consultas_menu_texts = {
	'ejes': 'EJES',
	'categorias': 'CATEGORÍAS',
}

def randomString(stringLength=10):
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(stringLength))
    
def randomUrl():
    return 'http://' + randomString()  + '.com'
    
# Variables internas
# este nombre lo vamos a cambiar cuando testeemos el perfil
last_admin_name = ''
# url de consulta de prubea
consulta_test_url = randomString()
#consulta_test_url = 'test1'
    
driver = webdriver.Firefox()

# Locating Elements - https://selenium-python.readthedocs.io/locating-elements.html
# Ejemplos:
#element = driver.find_element_by_id("passwd-id")
#element = driver.find_element_by_name("passwd")
#element = driver.find_element_by_xpath("//input[@id='passwd-id']")
#content = driver.find_element_by_class_name('content')
#content = driver.find_element_by_css_selector('p.content')
#all_options = element.find_elements_by_tag_name("option")
#continue_link = driver.find_element_by_link_text('Continue')
#continue_link = driver.find_element_by_partial_link_text('Conti')

class Tests:
	@staticmethod
	def ayuda():
		driver.get(main_page)
		
		driver.find_element_by_css_selector("a.header-link.hidden-md-down").click()
		driver.find_element_by_link_text('Estadisticas').click()
		
	@staticmethod
	def buscador():
		driver.get(main_page)
		
		# tabs buscador
		eles = driver.find_elements_by_css_selector(".filter-container ul.dropdown-content > li")
		for ele in eles:
			ele.click()
		
		# buscador
		ele = driver.find_element_by_name("term")
		ele.click()
		ele.send_keys('a')
		ele = driver.find_element_by_css_selector(".searchbar > button")
		ele.click()
		
	@staticmethod
	def login():
		driver.get(main_page)
		
		driver.find_element_by_css_selector("a.header-link.anon-user").click()
		driver.find_element_by_name("email").send_keys(admin_email)
		driver.find_element_by_name("password").send_keys(admin_pass)
		driver.find_element_by_css_selector("button.btn-block.btn-primary").click()
		WebDriverWait(driver, 10).until(
			EC.presence_of_element_located((By.CSS_SELECTOR, ".user-badge"))
		)
		
	@staticmethod
	def ir_a_configuracion():
		#driver.get(main_page + 'ajustes/perfil')
		driver.find_element_by_css_selector(".user-badge button").click()
		driver.find_element_by_link_text('CONFIGURACIÓN').click()
		
	@staticmethod
	def cambiar_perfil():
		Tests.ir_a_configuracion()
		
		def cambiar_datos():
			global last_admin_name
			
			driver.find_element_by_link_text(ajustes_menu_texts['perfil']).click()
			
			# nombre
			ele = driver.find_element_by_name("firstName")
			ele.clear()
			last_admin_name = randomString()
			ele.send_keys(last_admin_name)
			# apellido
			ele = driver.find_element_by_name("lastName")
			ele.clear()
			ele.send_keys(randomString())
			# idioma
			opts = driver.find_elements_by_tag_name("option")
			rand_opt = random.randint(0, len(opts)-1)
			opts[rand_opt].click()			
			# foto
			ele = driver.find_element_by_name("profilePictureUrl")
			ele.clear()
			ele.send_keys(randomUrl())
			# guardar
			driver.find_element_by_css_selector("button.btn-block.btn-success").click()
		
		def cambiar_pass():
			driver.find_element_by_link_text(ajustes_menu_texts['contraseña']).click()
			
			driver.find_element_by_name("current_password").send_keys(admin_pass)
			driver.find_element_by_name("password").send_keys(admin_pass)
			driver.find_element_by_name("confirm_password").send_keys(admin_pass)
			driver.find_element_by_css_selector(".password-settings button.btn-block.btn-success").click()
		
		def cambiar_notificaciones():
			driver.find_element_by_link_text(ajustes_menu_texts['notificaciones']).click()
			
			togs = driver.find_elements_by_css_selector(".toggle")
			for tog in togs:
				tog.click()
			driver.find_element_by_css_selector(".notifications-settings button.btn-block.btn-success").click()
		
		def cambiar_etiqueta_usu():
			driver.find_element_by_link_text(ajustes_menu_texts['gestion_de_usuarios']).click()
			
			ele = driver.find_element_by_css_selector(".user-search input")
			ele.clear()
			ele.send_keys(last_admin_name)
			WebDriverWait(driver, 10).until(
				EC.presence_of_element_located((By.CSS_SELECTOR, ".add-user-input .dropdown .item"))
			)
			driver.find_element_by_css_selector(".add-user-input .dropdown").click()
			ele = driver.find_element_by_name("badge")
			ele.clear()
			ele.send_keys(randomString())
			driver.find_element_by_id("submit-badge").click()
			
		cambiar_datos()
		cambiar_pass()
		cambiar_notificaciones()
		cambiar_etiqueta_usu()
		
	@staticmethod
	def ir_a_consulta_test():
		driver.get(main_page + consulta_test_url + '/admin')
		
	@staticmethod
	def crear_consulta():
		Tests.ir_a_configuracion()
		WebDriverWait(driver, 10).until(
			EC.presence_of_element_located((By.LINK_TEXT, ajustes_menu_texts['consultas']))
		)
		driver.find_element_by_link_text(ajustes_menu_texts['consultas']).click()
		
		driver.find_element_by_css_selector('.actions a.btn').click()
		driver.find_element_by_name("name").send_keys(consulta_test_url)
		driver.find_element_by_name("title").send_keys(randomString())
		driver.find_element_by_name("summary").send_keys(randomString())
		#??tipo contenido??
		driver.find_element_by_css_selector(".summary .ql-editor").send_keys(randomString())
		driver.find_element_by_name("cover").send_keys(randomUrl())
		driver.find_element_by_name("closingAt").send_keys('11/11/2010')
		driver.find_element_by_name("palabrasCierre").send_keys(randomString())
		driver.find_element_by_name("linkCierre").send_keys(randomUrl())
		driver.find_element_by_css_selector(".forum-new-form button.btn-block").click()
		
	@staticmethod
	def crear_consulta_categoria():
		Tests.ir_a_consulta_test()
		WebDriverWait(driver, 10).until(
			EC.presence_of_element_located((By.LINK_TEXT, consultas_menu_texts['categorias']))
		)
		driver.find_element_by_link_text(consultas_menu_texts['categorias']).click()
		
		try:
			ele = driver.find_element_by_css_selector("#tags-wrapper .btn.new")
			ele.click()
		except NoSuchElementException as e:
			# no hay categorías cargadas, entonces ya estamos en el formulario de creación
			print('Ya hay categorías')
			pass
		
		driver.find_element_by_name("name").send_keys(randomString())
		eles = driver.find_elements_by_css_selector(".tag-images .tag-image")
		rand_ele = random.randint(0, len(eles)-1)
		eles[rand_ele].click()			
		driver.find_element_by_css_selector(".tag-admin button.btn-block").click()
		
	@staticmethod
	def crear_consulta_eje():
		Tests.ir_a_consulta_test()
		WebDriverWait(driver, 10).until(
			EC.presence_of_element_located((By.LINK_TEXT, consultas_menu_texts['ejes']))
		)
		driver.find_element_by_link_text(consultas_menu_texts['ejes']).click()
		
		driver.find_element_by_css_selector(".topics-admin .btn.new").click()
		driver.find_element_by_name("mediaTitle").send_keys(randomString())
		driver.find_element_by_css_selector(".tags-autocomplete .tags-input input").send_keys(
			randomString(), Keys.RETURN,
			randomString(), Keys.RETURN
		)
		driver.find_element_by_name("attrs.pregunta").send_keys(randomString())
		driver.find_element_by_name("topicId").send_keys(randomString())
		driver.find_element_by_name("coverUrl").send_keys(randomUrl())
		driver.find_element_by_name("author").send_keys(randomString())
		driver.find_element_by_name("authorUrl").send_keys(randomUrl())
		#??acción??
		driver.find_element_by_name("source").send_keys(randomUrl())
		driver.find_element_by_css_selector("#editor .ql-editor").send_keys(randomString())
		driver.find_element_by_name("closingAt").click()
		eles = driver.find_elements_by_css_selector(".datepicker-popover .calendar-days tbody a.next-day")
		eles[len(eles)-1].click()
		driver.find_element_by_css_selector("button.add-link.btn").click()
		driver.find_element_by_css_selector(".topic-links .topic-link .link-text input").send_keys(randomString())
		driver.find_element_by_css_selector(".topic-links .topic-link .link-url input").send_keys(randomUrl())
		driver.find_element_by_css_selector(".commands a.btn.save").click()
		
		# ir a eje
		WebDriverWait(driver, 10).until(
			EC.presence_of_element_located((By.CSS_SELECTOR, '#topic-wrapper h2 a.btn'))
		)
		driver.find_element_by_css_selector('#topic-wrapper h2 a.btn').click()
		
		# comentar
		'''
		print(driver.window_handles)
		for handle in driver.window_handles:
		driver.switch_to_window(driver.window_handles[0])
			print(handle)
		WebDriverWait(driver, 10).until(
			EC.presence_of_element_located((By.CSS_SELECTOR, "#comments-form textarea.comments-create"))
		)
		driver.find_element_by_css_selector('#comments-form textarea.comments-create').send_keys(randomString())
		driver.find_element_by_css_selector('#comments-form button.btn-outline-success').click()
		'''
		
try:
	Tests.ayuda()
	Tests.buscador()
	Tests.login()
	Tests.cambiar_perfil()
	Tests.crear_consulta()
	Tests.crear_consulta_categoria()
	Tests.crear_consulta_eje()
except Exception: 
	import sys, traceback
	traceback.print_exc(file=sys.stdout)

time.sleep(3)
driver.close()
