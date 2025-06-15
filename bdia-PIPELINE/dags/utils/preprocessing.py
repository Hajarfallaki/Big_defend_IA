import pandas as pd
import numpy as np



def nettoyer_donnees(df) :
    
   
   # 2. Supprimer les lignes avec des valeurs manquantes dans la cible
    df = df.dropna(subset=["Is_Fraud"])
   # 3. Ajouter des features simulées

    # a) Transaction_Category (achat, retrait, virement)
    np.random.seed(42)  # pour reproductibilité
    df["Transaction_Category"] = np.random.choice(["achat", "retrait", "virement"], size=len(df))
    df = pd.get_dummies(df, columns=["Transaction_Category"])

    # b) Is_Large_Transaction (1 si montant élevé)
    df["Is_Large_Transaction"] = (df["Transaction_Amount"] > 0.5).astype(int)

    # c) Balance_Change (variation du solde après transaction)
    df["Balance_Change"] = df["Transaction_Amount"] * np.random.uniform(-1.5, 1.5, size=len(df))

    # d) Is_New_User (nouvel utilisateur ou non)
    df["Is_New_User"] = np.random.choice([0, 1], size=len(df), p=[0.7, 0.3])

    # e) Amount_vs_Balance (ratio entre le montant et le solde, éviter la division par 0)
    df["Amount_vs_Balance"] = df["Transaction_Amount"] / (df["Account_Balance"] + 1e-6)

    # 4. Afficher les premières lignes pour vérification
   # print(df.head())
   # print(df.head(5).to_string())

    # 5. Enregistrer le nouveau dataset si besoin
    df.to_csv("Bank_Transaction_Fraud_Detection_FE.csv", index=False)
    print("______________________ fin fe preporcess_______________")
    return df # retourne un csv que nous aloons recruperer 
