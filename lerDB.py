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
load_dotenv()
host = os.getenv('DB_HOST')
user = os.getenv('DB_USER')
db_password = os.getenv('DB_PASSWORD')

banco = "advogados_iturn"
import json
def teste():
    print("Teste")
    
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
            if dataFim == "":
                print("dataFim é vazio")
                query = f'select id_empresa, id_tabela,status,ultimo_update, data_emissao, tabela from tb_notas_fiscais where data_emissao > {dataInicio}'
            else:
                query = f'select id_empresa, id_tabela,status, data_emissao, tabela from tb_notas_fiscais where data_emissao > {dataInicio} and data_emissao < {dataFim}'

            print(query)
            print("\nexecutando o select\n")
            #cursor.execute(query)
            #records = cursor.fetchall()
            #for record in records:
                #print(record)
           
                                
            cursor.close()
            

    except Error as e:
        print("Erro ao conectar ao MySQL", e)
    finally:
        if connection is not None and connection.is_connected():
            connection.close()
       
def buscarDados(data):
    print("lendo a função buscarDados")
    print(data)
    print("lendo no banco de dados")
    process_file(data['dataInicio'], data['dataFim'], data['status'], data['idEmpresa'])
    return data

