import pandas as pd
from sqlalchemy import create_engine

import mysql.connector


"""""
# Paramètres de connexion MySQL
#   user = 'ton_utilisateur'
password = 'ton_mot_de_passe'
host = 'localhost'  # ou IP du serveur MySQL
port = '3306'
database = 'nom_de_la_base'

   # Chemin vers ton fichier CSV
csv_file = 'chemin/vers/ton_fichier.csv'

"""""
## funtion pour sauvegarder dans mysql avec un fichier csv


def sauvegarder_mysql(user, password, host, port, database, df, nom_table):
    # Créer l'engine SQLAlchemy pour MySQL
    engine = create_engine(f'mysql+mysqlconnector://{user}:{password}@{host}:{port}/{database}')

    # Sauvegarder dans la table spécifiée, en l'écrasant si elle existe
    df.to_sql(name=nom_table, con=engine, if_exists='replace', index=False)

    print(f"Données sauvegardées avec succès dans la table '{nom_table}' (écrasée si elle existait) !")




"""""
# Paramètres de connexion MySQL
user = 'ton_utilisateur'
password = 'ton_mot_de_passe'
host = 'localhost'  # ou IP serveur MySQL
port = '3306'
database = 'nom_de_la_base'

# Nom de la table à exporter
table_name = 'ta_table'

# Nom du fichier CSV de sortie
output_csv = f'{table_name}.csv' """""


"""""
def importer_table_depuis_csv(user,password,host,port,database,table_name,output_csv=f'{table_name}.csv') :
   # Créer la connexion SQLAlchemy
   engine = create_engine(f'mysql+mysqlconnector://{user}:{password}@{host}:{port}/{database}')

   # Charger toute la table dans un DataFrame pandas
   df = pd.read_sql(f'SELECT * FROM {table_name}', con=engine)

   # Exporter vers CSV (sans l’index pandas)
   df.to_csv(output_csv, index=False)

   print(f"Table '{table_name}' exportée avec succès dans '{output_csv}'")
   return df
"""""




 

""""

 insertion de  de une ligne de colonne 
"""
def Enregistrer_une_ligne(user,password,host,database,table_name,colonne,valeur) :

    # Paramètres de connexion
    conn = mysql.connector.connect(
      host=host,
      user=user,
      password=password,
      database=database
     )
   
    cursor = conn.cursor()

    # === Entrées dynamiques ===
    table = table_name

    colonnes = colonne         # Liste des colonnes
    valeurs = valeur           # Valeurs à insérer (dans le même ordre)

    # Générer dynamiquement la requête SQL
    colonnes_str = ', '.join(colonnes)
    placeholders = ', '.join(['%s'] * len(valeurs))
    sql = f"INSERT INTO {table} ({colonnes_str}) VALUES ({placeholders})"

    # Exécuter
    try:
      cursor.execute(sql, valeurs)
      conn.commit()
      print("Ligne insérée avec succès.")
    except mysql.connector.Error as err:
      print("Erreur :", err)
    finally:
      cursor.close()
      conn.close()

