import sympy as sp
import numpy as np
import streamlit as st
import matplotlib.pyplot as plt
import pandas as pd 
from PIL import Image
from Utils import utils_sp as ut

#Definir Simbolos del modelo
M,P,k,h,c,t,b,Ca,Ta,Ia,Tr,G,NX,L,Y,DA,I,T,C,A,i,Yd = sp.symbols('M,P,k,h,c,t,b,Ca,Ta,Ia,Tr,G,NX,L,Y,DA,I,T,C,A,i,Yd')

        
#Clase del modelo
class ISLMProcess:

    def __init__(self):

        self.Leq = None
        self.MPeq = None
        self.LM = None
        self.Aeq = None
        self.LS = None
        self.iequ = None
        self.yeq = None
        self.ieq = None

    @staticmethod
    def validate_parameters(M, P, k, h, c, t, b):
        """Valida los parámetros del modelo para evitar errores de cálculo."""
        errors = []
        warnings = []

        # Validaciones críticas (pueden causar errores)
        if P == 0:
            errors.append("El nivel de precios (P) no puede ser cero.")
        if k == 0:
            errors.append("La sensibilidad a la renta (k) no puede ser cero.")
        if h == 0:
            warnings.append("Sensibilidad al interés (h) = 0: curva LM vertical (trampa clásica).")

        # Validaciones de rango
        if not (0 <= c <= 1):
            errors.append(f"La propensión al consumo (c={c}) debe estar entre 0 y 1.")
        if not (0 <= t <= 1):
            errors.append(f"La tasa impositiva (t={t}) debe estar entre 0 y 1.")

        # Validación de singularidad de la matriz
        denominator = 1 - c*(1-t)
        if abs(denominator) < 0.001:
            warnings.append("Advertencia: El multiplicador fiscal es muy alto (cercano a infinito).")

        return errors, warnings

    @staticmethod
    def export_results_to_csv(eq_data, params, filename="resultados_islm.csv"):
        """Exporta los resultados del modelo a un archivo CSV."""
        data = {**eq_data, **params}
        df = pd.DataFrame([data])
        return df.to_csv(index=False) 
    
    #agregar parametros
    def parameters(leftcola,leftcolb,rightcola,rightcolb):

        with leftcola:
            st.write('')
            kp = st.number_input('Sensldad.-Renta (k)',0,10000,1)
            hp = st.number_input('Sensldad.-t_rinteres (h)',0,10000,1)
            Mp = st.number_input('Oferta Monetaria (M)',0,10000,400)
            Pp = st.number_input('Nivel de Precios (P)',0,10000,1)
            
        with leftcolb:
            st.write('---')
            Trp = st.number_input('Transferencias (Tr)',0,10000,0)
            st.write('')
            Gp = st.number_input('Gasto (G)',0,10000,1000)
            st.write('')
            NXp = st.number_input('Export. Netas (NX)',0,10000,0)
            
        with rightcola:
            st.write('---')
            Cap = st.number_input('Cons. Autonomo (Ca)',0,10000,0)
            st.write('')
            Tap = st.number_input('Impuesto Autonomo (Ta)',0,10000,0)
            st.write('')
            Iap = st.number_input('Interes Autonomo (Ia)',0,10000,0)  
        with rightcolb:
            st.write('---')
            cp = st.number_input('Prop. al consumo (c)',min_value=float(0), max_value=float(1),value=0.8,step=0.01)
            st.write('')
            tp = st.number_input('Tasa Impositiva (t)',min_value=float(0), max_value=float(1),value=0.2,step=0.01)
            st.write('')
            bp = st.number_input('Senbldad.-inversion (b)',0,10000,1)
            
        data = {'Oferta Monetaria':round(Mp,2), 'Nivel de Precios':round(Pp,2), 'Sensibilidad a la Renta':round(kp,2),
                                    'Sensibilidad al tipo de interes':round(hp,2), 'Pmg':round(cp,2), 'Tasa Impositiva':round(tp,2),
                                    'Sensibilidad de la inversion':round(bp,2), 'Consumo Autonomo':round(Cap,2),'Impuesto Autonomo':round(Tap,2),
                        'Inversión Autonoma':round(Iap,2),'Trasnferencias':round(Trp,2),'Gasto':round(Gp,2),'Exportaciones Netas':round(NXp,2)}
        feactures = pd.DataFrame(data,index=['Parameters'])
        
        return feactures.loc['Parameters']

    #agregar deplazamientos
    def deltas(leftcola,leftcolb,rightcola,rightcolb):
        with leftcola:
            st.write('')
            Dkp = st.number_input('Delta (k)',-10000,10000,0)
            Dhp = st.number_input('Delta (h)',-10000,10000,0)
            DMp = st.number_input('Delta (M)',-100000,100000,0)
            DPp = st.number_input('Delta (P)',-100000,100000,0)
            
        with leftcolb:
            st.write('---')
            DTrp = st.number_input('Delta (Tr)',-100000,100000,0)
            st.write('')
            DGp = st.number_input('Delta (G)',-100000,100000,0)
            st.write('')
            DNXp = st.number_input('Delta (NX)',-100000,10000,0)
            
        with rightcola:
            st.write('---')
            DCap = st.number_input('Delta (Ca)',-100000,100000,0)
            st.write('')
            DTap = st.number_input('Delta (Ta)',-100000,100000,0)
            st.write('')
            DIap = st.number_input('Delta (Ia)',-100000,100000,0)  

        with rightcolb:
            st.write('---')
            Dcp = st.number_input('Delta (c)',min_value=float(-1), max_value=float(1),value=float(0),step=0.01)
            st.write('')
            Dtp = st.number_input('Delta (t)',min_value=float(-1), max_value=float(1),value=float(0),step=0.01)
            st.write('')
            Dbp = st.number_input('Delta (b)',-10000,10000,0)
            
        Ddata = {'Oferta Monetaria':round(DMp,2), 'Nivel de Precios':round(DPp,2), 'Sensibilidad a la Renta':round(Dkp,2),
                                    'Sensibilidad al tipo de interes':round(Dhp,2), 'Pmg':round(Dcp,2), 'Tasa Impositiva':round(Dtp,2),
                                    'Sensibilidad de la inversion':round(Dbp,2), 'Consumo Autonomo':round(DCap,2),'Impuesto Autonomo':round(DTap,2),
                        'Inversión Autonoma':round(DIap,2),'Trasnferencias':round(DTrp,2),'Gasto':round(DGp,2),'Exportaciones Netas':round(DNXp,2)}
        Dfeactures = pd.DataFrame(Ddata,index=['Parameters'])
        return Dfeactures.loc['Parameters']


    #Print de image definition
    def img_definition():
        image = Image.open('islm.jpg')
        return image

    #Obtener procedimiento general
    def make_procces(self):

        self.Leq = ut.Equation(L,k*Y-h*i)
        self.MPeq = ut.Equation(L,M/P)
        self.LM = ut.Equation(self.MPeq.rhs,self.Leq.rhs).solution_equals(Y,Y)
        self.Aeq = ut.Equation(A,Ca + Ia + G + NX + c*(Tr - Ta))
        self.LS = ut.Equation(Y,(self.Aeq.lhs-b*i)/(1-c*(1-t)))
        self.iequ = ut.Equation(self.LM.rhs,self.LS.rhs)
        self.ieq = self.iequ.solution_equals(i,i)
        self.yeq = ut.Equation(Y,self.LS.subs(i,self.ieq.rhs).rhs)
        eq = [self.Leq,self.MPeq,self.LM,self.Aeq,self.LS,self.iequ,self.ieq,self.yeq]
        return [sp.latex(e) for e in eq]

    #Realizar un ejercicio dado los parametros
    def make_exercise(self,M_,P_,k_,h_,c_,t_,b_,Ca_,Ta_,Ia_,Tr_,G_,NX_):
        self.Leq = ut.Equation(L,k_*Y-h_*i)
        self.MPeq = ut.Equation(M/P,M_/P_)
        inter = ut.Equation(self.Leq.rhs,self.MPeq.rhs).evalf(3)
        self.LM = ut.Equation(self.MPeq.rhs,self.Leq.rhs).solution_equals(Y,Y).evalf(3)
        self.Aeq = ut.Equation(A,Ca_ + Ia_ + G_ + NX_ + c_*(Tr_ - Ta_)).evalf(3)
        self.LS = ut.Equation(Y,(self.Aeq.rhs-b_*i)/(1-c_*(1-t_))).evalf(3)
        self.iequ = ut.Equation(self.LM.rhs,self.LS.rhs)
        self.ieq = self.iequ.solution_equals(i,i).evalf(3)
        self.yeq = ut.Equation(Y,self.LS.subs(i,self.ieq.rhs).rhs).evalf(3)
        eq = [self.Leq,self.MPeq,inter,self.LM,self.Aeq,self.LS,self.iequ,self.ieq,self.yeq]
        return [sp.latex(e) for e in eq]

    #Realiza desplazamiento de mercados por cambios de factores
    def desplazamiento(self,M_,P_,k_,h_,c_,t_,b_,Ca_,Ta_,Ia_,Tr_,G_,NX_):
        self.Leq0 = ut.Equation(L,k_*Y-h_*i)
        self.MPeq0 = ut.Equation(L,M_/P_)
        self.LM0 = ut.Equation(self.MPeq0.rhs,self.Leq0.rhs).solution_equals(Y,Y).evalf(3)
        self.Aeq0 = ut.Equation(A,Ca_ + Ia_ + G_ + NX_ + c_*(Tr_ - Ta_))
        self.LS0 = ut.Equation(Y,(self.Aeq0.rhs-b_*i)/(1-c_*(1-t_)))
        self.iequ0 = ut.Equation(self.LM0.rhs,self.LS0.rhs)
        self.ieq0 = self.iequ0.solution_equals(i,i)
        self.yeq0 = ut.Equation(Y,self.LS0.subs(i,self.ieq0.rhs).rhs)
        eq = [self.Leq0,self.MPeq0,self.LM0,self.Aeq0,self.LS0,self.iequ0,self.ieq0,self.yeq0]
        return [sp.latex(e) for e in eq]

    #DESCRIPCIÓN DEL MODELO
    def get_description(M_,P_,k_,h_,c_,t_,b_,Ca_,Ta_,Ia_,Tr_,G_,NX_):
    ## get the equations of the model
        Leq = sp.Eq(L,k_*Y-h_*i)
        M_a = sp.Eq(M,M_)
        Peq = sp.Eq(P,P_)
        Treq = sp.Eq(Tr,Tr_)
        Geq = sp.Eq(G,G_)
        NXeq = sp.Eq(NX,NX_)
        Teq = sp.Eq(T,Ta_ + t_*Y)
        Yd_ = Y - Teq.rhs + Tr_
        Ydeq = sp.Eq(Yd,Yd_)
        Ceq = sp.Eq(C,Ca_+c_*Yd_)
        Ieq = sp.Eq(I,Ia_-b_*i)
        list = [Leq,M_a,Peq,Treq,Geq,NXeq,Teq,Ydeq,Ceq,Ieq]
        return [sp.latex(i) for i in list]


    #GRAFICOS
    def graficar(M,P,k,h,c,t,b,Ca,Ta,Ia,Tr,G,NX,
                DM,DP,Dk,Dh,Dc,Dt,Db,DCa,DTa,DIa,DTr,DG,DNX):

        #entradas normales - rectas 

        plt.rcParams.update({'font.size': 22})
        i = np.linspace(0,10000)
        M_P = M/P 
        Y1 = M_P/k + (h*i)/k
        A = Ca + Ia + G + NX + c*(Tr - Ta) 
        Y2 = (A-b*i)/(1-c*(1-t))
        C = np.array([[k,-h],[1-c*(1-t),b]])
        B = np.array([[M_P],[A]])
        X = np.linalg.inv(C).dot(B)
        i1 = np.linspace(0,X[0]*k/h+100)
        Y = np.linspace(0,X[0]+X[0]*0.3)

        #deltas: son la configuración de los desplazamientos
        deltasIS = np.array([Dc,Dt,Db,DCa,DTa,DIa,DTr,DG,DNX])
        deltasLM = np.array([DM,DP,Dk,Dh])

        # Nuevos parámetros con deltas aplicados
        M_new = M + DM
        P_new = P + DP
        k_new = k + Dk
        h_new = h + Dh
        c_new = c + Dc
        t_new = t + Dt
        b_new = b + Db
        Ca_new = Ca + DCa
        Ta_new = Ta + DTa
        Ia_new = Ia + DIa
        Tr_new = Tr + DTr
        G_new = G + DG
        NX_new = NX + DNX

        # Nueva oferta monetaria real
        DM_P = M_new / P_new if P_new != 0 else M_P

        # Nueva curva LM (con deltas)
        DY1 = DM_P/k_new + (h_new*i)/k_new if k_new != 0 else Y1

        # Nueva demanda agregada autónoma (con deltas)
        D_A = Ca_new + Ia_new + G_new + NX_new + c_new*(Tr_new - Ta_new)

        # Nueva curva IS (con deltas)
        denominator_new = 1 - c_new*(1 - t_new)
        DY2 = (D_A - b_new*i) / denominator_new if denominator_new != 0 else Y2

        # Nuevo equilibrio
        DC = np.array([[k_new, -h_new], [1 - c_new*(1 - t_new), b_new]])
        DB = np.array([[DM_P], [D_A]])
        try:
            DX = np.linalg.inv(DC).dot(DB)
        except np.linalg.LinAlgError:
            DX = X  # Si la matriz es singular, usar el equilibrio original

        Di1 = np.linspace(0, DX[0]*k_new/h_new + 100 if h_new != 0 else 100)
        DY = np.linspace(0, DX[0] + DX[0]*0.3)

        ##grafica equilibrio mercado

        fig1, ax = plt.subplots(figsize=(10, 8))
        ax.plot(i, Y1, 'b-', linewidth=2)
        ax.plot(i, Y2, 'r-', linewidth=2)

        # Punto de equilibrio inicial
        Y_eq = float(X[0])
        i_eq = float(X[1])
        ax.scatter([i_eq], [Y_eq], color='green', s=150, zorder=5, marker='o')
        ax.annotate(f'E₁ ({i_eq:.1f}, {Y_eq:.1f})',
                   xy=(i_eq, Y_eq), xytext=(i_eq + i_eq*0.1, Y_eq + Y_eq*0.05),
                   fontsize=12, color='green', fontweight='bold')

        # Líneas punteadas al equilibrio
        ax.axhline(y=Y_eq, color='gray', linestyle='--', alpha=0.5, linewidth=1)
        ax.axvline(x=i_eq, color='gray', linestyle='--', alpha=0.5, linewidth=1)

        ax.set_xlim(0, float(X[1]) + X[1]*0.3)
        ax.set_ylim(0, int(X[0] + X[0]*0.3))
        ax.set_xlabel('Tasa de Interés (i)')
        ax.set_ylabel('Producto Total (Y)')
        ax.set_title('EQUILIBRIO IS-LM')

        if np.any(deltasIS != 0):
            ax.plot(i, DY2, 'r--', linewidth=2)

            if np.any(deltasLM != 0):
                ax.plot(i, DY1, 'b--', linewidth=2)
                # Punto de equilibrio nuevo
                Y_eq_new = float(DX[0])
                i_eq_new = float(DX[1])
                ax.scatter([i_eq_new], [Y_eq_new], color='purple', s=150, zorder=5, marker='s')
                ax.annotate(f'E₂ ({i_eq_new:.1f}, {Y_eq_new:.1f})',
                           xy=(i_eq_new, Y_eq_new), xytext=(i_eq_new + i_eq_new*0.1, Y_eq_new - Y_eq_new*0.05),
                           fontsize=12, color='purple', fontweight='bold')
                ax.legend(['LM₁', 'IS₁', 'IS₂', 'LM₂'])
            else:
                # Calcular nuevo equilibrio solo IS
                DC_is = np.array([[k, -h], [1 - c_new*(1 - t_new), b_new]])
                DB_is = np.array([[M_P], [D_A]])
                try:
                    DX_is = np.linalg.inv(DC_is).dot(DB_is)
                    Y_eq_new = float(DX_is[0])
                    i_eq_new = float(DX_is[1])
                    ax.scatter([i_eq_new], [Y_eq_new], color='purple', s=150, zorder=5, marker='s')
                    ax.annotate(f'E₂ ({i_eq_new:.1f}, {Y_eq_new:.1f})',
                               xy=(i_eq_new, Y_eq_new), xytext=(i_eq_new + i_eq_new*0.1, Y_eq_new - Y_eq_new*0.05),
                               fontsize=12, color='purple', fontweight='bold')
                except:
                    pass
                ax.legend(['LM₁', 'IS₁', 'IS₂'])

        elif np.any(deltasLM != 0):
            ax.plot(i, DY1, 'b--', linewidth=2)
            # Calcular nuevo equilibrio solo LM
            DC_lm = np.array([[k_new, -h_new], [1 - c*(1 - t), b]])
            DB_lm = np.array([[DM_P], [A]])
            try:
                DX_lm = np.linalg.inv(DC_lm).dot(DB_lm)
                Y_eq_new = float(DX_lm[0])
                i_eq_new = float(DX_lm[1])
                ax.scatter([i_eq_new], [Y_eq_new], color='purple', s=150, zorder=5, marker='s')
                ax.annotate(f'E₂ ({i_eq_new:.1f}, {Y_eq_new:.1f})',
                           xy=(i_eq_new, Y_eq_new), xytext=(i_eq_new + i_eq_new*0.1, Y_eq_new - Y_eq_new*0.05),
                           fontsize=12, color='purple', fontweight='bold')
            except:
                pass
            ax.legend(['LM₁', 'IS₁', 'LM₂'])

        else:
            ax.legend(['LM', 'IS'])

        ##grafica IS (Mercado de Bienes)

        fig2, ax2 = plt.subplots(figsize=(10, 8))
        DA_values = A + c*(1-t)*Y - b*X[1]
        ax2.plot(Y, DA_values, 'r-', linewidth=2, label='Demanda Agregada (DA)')
        ax2.plot(Y, Y, 'b-', linewidth=2, label='Y = DA (45°)')

        # Punto de equilibrio en el mercado de bienes
        Y_eq = float(X[0])
        ax2.scatter([Y_eq], [Y_eq], color='green', s=150, zorder=5, marker='o')
        ax2.annotate(f'Equilibrio Y* = {Y_eq:.1f}',
                    xy=(Y_eq, Y_eq), xytext=(Y_eq*0.6, Y_eq*1.1),
                    fontsize=11, color='green', fontweight='bold',
                    arrowprops=dict(arrowstyle='->', color='green', lw=1.5))

        ax2.axhline(y=Y_eq, color='gray', linestyle='--', alpha=0.5, linewidth=1)
        ax2.axvline(x=Y_eq, color='gray', linestyle='--', alpha=0.5, linewidth=1)

        ax2.legend(loc='upper left')
        ax2.set_xlabel('Producto (Y)')
        ax2.set_ylabel('Demanda Agregada (DA)')
        ax2.set_title('MERCADO DE BIENES - Construcción IS')
        ax2.set_xlim(0, float(X[0]) + X[0]*0.3)
        ax2.set_ylim(0, int(X[0] + X[0]*0.3))

        ##grafica LM (Mercado de Dinero)

        fig3, ax3 = plt.subplots(figsize=(10, 8))
        L_demand = k*X[0] - h*i1  # Demanda de dinero L = kY - hi
        mp = np.array([M_P for _ in range(len(i1))])  # Oferta de dinero M/P

        ax3.plot(L_demand, i1, 'r-', linewidth=2, label='Demanda de Dinero (L)')
        ax3.plot(mp, i1, 'b-', linewidth=2, label='Oferta de Dinero (M/P)')

        # Punto de equilibrio en el mercado de dinero
        i_eq = float(X[1])
        ax3.scatter([M_P], [i_eq], color='green', s=150, zorder=5, marker='o')
        ax3.annotate(f'Equilibrio i* = {i_eq:.2f}',
                    xy=(M_P, i_eq), xytext=(M_P*0.5, i_eq*1.3),
                    fontsize=11, color='green', fontweight='bold',
                    arrowprops=dict(arrowstyle='->', color='green', lw=1.5))

        ax3.axhline(y=i_eq, color='gray', linestyle='--', alpha=0.5, linewidth=1)

        ax3.legend(loc='upper right')
        ax3.set_xlabel('Dinero (L, M/P)')
        ax3.set_ylabel('Tasa de Interés (i)')
        ax3.set_title('MERCADO DE DINERO - Construcción LM')
        ax3.set_xlim(0, M_P + M_P*0.3)
        ax3.set_ylim(0, max(i_eq*2, 10))

        # Preparar datos de equilibrio para retorno
        equilibrium_data = {
            'Y_equilibrio': round(float(X[0]), 2),
            'i_equilibrio': round(float(X[1]), 4),
            'A_autonomo': round(A, 2),
            'M_P_real': round(M_P, 2)
        }

        # Si hay desplazamiento, añadir nuevo equilibrio
        if np.any(deltasIS != 0) or np.any(deltasLM != 0):
            equilibrium_data['Y_equilibrio_nuevo'] = round(float(DX[0]), 2)
            equilibrium_data['i_equilibrio_nuevo'] = round(float(DX[1]), 4)
            equilibrium_data['Delta_Y'] = round(float(DX[0]) - float(X[0]), 2)
            equilibrium_data['Delta_i'] = round(float(DX[1]) - float(X[1]), 4)

        return fig1, fig2, fig3, equilibrium_data


if __name__ == '__main__':
    with open('ISLM/equation.txt','w') as f:
        for i in ISLMProcess().make_procces():
            f.write(i)
            f.write('\n')