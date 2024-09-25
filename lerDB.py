from email.mime.application import MIMEApplication
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import mysql.connector
from mysql.connector import Error
import requests
from dotenv import load_dotenv
import pandas as pd
import os
import json
import shutil
from os.path import basename
import smtplib
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from flask import send_file
import io
load_dotenv()
host = os.getenv('DB_HOST')
user = os.getenv('DB_USER')
db_password = os.getenv('DB_PASSWORD')

banco = "advogados_iturn"
import json
def teste():
    print("Teste")

def criarPasta (pasta):
    
    if os.path.exists(pasta) == False:
        os.makedirs(pasta)
        
    return len(os.listdir(pasta))
        

    
def process_file(dataInicio, dataFim, status, idEmpresa):
    print("lendo a função process_file")
    connection = None
    try:
        connection = mysql.connector.connect(
            host=host,
            database=banco,
            user=user,
            password=db_password
        )
        print("conectando no banco de dados")
        if connection.is_connected():
            cursor = connection.cursor()
            print("dataFim: ", dataFim)
            print("dataInicio: ", dataInicio)
            query = f"select id_empresa, id_tabela,status,ultimo_update, data_emissao, tabela from tb_notas_fiscais where data_emissao > '{dataInicio}'"
            if dataFim != "":
                query += f" and data_emissao < '{dataFim}'"
            
            if int(status) != 0:
                lista_status = [
                    '',
                    "ERROR",
                    "SCHEDULED",
                    "AUTHORIZED",
                    "CANCELED"
                ]
                status = int(status)
                query += f" and status = '{lista_status[status]}'"
            if idEmpresa != "":
                query += f" and id_empresa = '{idEmpresa}'"
            print(query)
            print("\nexecutando o select\n")
            cursor.execute(query)
            records = cursor.fetchall()
            
            lista_resultados = []
            for r in records:
                lista_resultados.append(list(r))
            
                    
            return lista_resultados

    except Error as e:
        print("Erro ao conectar ao MySQL", e)
    finally:
        if connection is not None and connection.is_connected():
            connection.close()
       
def buscarDados(data):
    print("lendo a função buscarDados")
    print(data)
   
    lista = process_file(data['dataInicio'], data['dataFim'], data['status'], data['idEmpresa'])
    
    if data['baixar'] == True:
        print('baixar arquivo')
        
    if data['enviarEmail'] == True:
        print('enviar arquivo por email')
    
    return lista

