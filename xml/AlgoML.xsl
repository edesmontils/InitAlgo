<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <!-- XSLT for Algorithms -->
    <!-- (c) E. Desmontils, Jul 2008 -->
    <!-- Created: 14/02/03 -->
    <!-- Last Mod: 24/07/08 -->
    <!-- Version 1.2 -->
    <xsl:output method="html"/>
    <xsl:key name="idVar" match="Var" use="@id"/>
    <!-- Algorithme -->
    <xsl:template match="Algorithm">
        <html>
            <head>
                <title>Algorithme : <xsl:value-of select="@name"/>
                </title>
            </head>
            <body style="font-family:Arial; size:12pt;" link="#FFFF00" vLink="#FFFFFF"
                alink="#FF0000">
                <h3>Début Algo <xsl:value-of select="@name"/></h3>
                <xsl:apply-templates/>
                <h3>Fin Algo <xsl:value-of select="@name"/></h3>
            </body>
        </html>
    </xsl:template>
    <!-- Fonction -->
    <xsl:template match="Function">
        //============================================== <br/>
        <xsl:if test="./@PreCondition!='' "> //precondition:&#160;<xsl:value-of
                select="@PreCondition"/>
            <BR/>
        </xsl:if>
        <xsl:if test="./@PostCondition!='' "> //postcondition:&#160;<xsl:value-of
                select="@PostCondition"/>
            <BR/>
        </xsl:if>
        <BR/>
        <b>fonction</b> &#160;<xsl:value-of select="@id"/>(&#160; <xsl:value-of
            select="ParamDecl/Param/@Status"/>&#160; <xsl:value-of select="ParamDecl/Param/@id"
        />: <xsl:value-of select="ParamDecl/Param/@Type"/>):&#160; <xsl:value-of
            select="RetValue/@Var"/>
        <br/>
        <xsl:if test="./@Comment!='' "> //&#160;<xsl:value-of select="@Comment"/>
            <BR/>
        </xsl:if>
        <xsl:apply-templates select="LocVarDecl"/>
        <xsl:apply-templates select="Code">
            <xsl:with-param name="in">no</xsl:with-param>
        </xsl:apply-templates> &#160;{<xsl:value-of select="@id"/>}<BR/>
        <BR/>
    </xsl:template>
    <!-- Procédure -->
    <xsl:template match="Procedure">
        //============================================== <br/>
        <xsl:if test="./@PreCondition!='' "> //precondition:&#160;<xsl:value-of
                select="@PreCondition"/>
            <BR/>
        </xsl:if>
        <xsl:if test="./@PostCondition!='' "> //postcondition:&#160;<xsl:value-of
                select="@PostCondition"/>
            <BR/>
        </xsl:if>
        <b>procedure</b> &#160;<xsl:value-of select="@id"/>(&#160; <xsl:value-of
            select="ParamDecl/Param/@Status"/>&#160; <xsl:value-of select="ParamDecl/Param/@id"
        />: <xsl:value-of select="ParamDecl/Param/@Type"/>)<br/>
        <xsl:if test="./@Comment!='' "> //&#160;<xsl:value-of select="@Comment"/>
            <BR/>
        </xsl:if>
        <xsl:apply-templates select="LocVarDecl"/>
        <xsl:apply-templates select="Code">
            <xsl:with-param name="in">no</xsl:with-param>
        </xsl:apply-templates> &#160;{<xsl:value-of select="@id"/>}<BR/>
        <BR/>
    </xsl:template>
    <!-- Déclaration de variables locales -->
    <xsl:template match="LocVarDecl">
        <xsl:apply-templates select="Var"/>
    </xsl:template>
    <!-- Déclaration d'une variable -->
    <xsl:template match="Var">
        <xsl:if test="position() = 1">
            <B>var</B>
            <br/>
        </xsl:if> &#160;&#160;&#160;&#160; <xsl:value-of select="@id"
            />:<xsl:value-of select="@Type"/>
        <br/>
    </xsl:template>
    <!-- Bloc de code -->
    <xsl:template match="Code">
        <xsl:param name="inc">no</xsl:param>
        <xsl:if test=" $inc='no' ">
            <B>début</B>
            <BR/>
        </xsl:if>
        <ul>
            <xsl:apply-templates/>
        </ul>
        <xsl:if test=" $inc='no' ">
            <B>fin</B>
        </xsl:if>
    </xsl:template>
    <!-- Tant que ... Faire ... Fin Tant Que -->
    <xsl:template match="While">
        <B>Tant que</B>&#160;<xsl:value-of select="Cond"/>&#160;<B>Faire</B>
        <BR/>
        <xsl:apply-templates select="Code">
            <xsl:with-param name="inc">yes</xsl:with-param>
        </xsl:apply-templates>
        <B>Fin Tant que</B>
        <BR/>
    </xsl:template>
    <!-- Répéter ... jusqu'à ... -->
    <xsl:template match="Repeat">
        <B>Repeter</B>
        <BR/>
        <xsl:apply-templates select="Code">
            <xsl:with-param name="inc">yes</xsl:with-param>
        </xsl:apply-templates>
        <B>jusqu'à</B>&#160;<xsl:value-of select="Cond"/>
        <BR/>
    </xsl:template>
    <!-- Appel de fonction ou procédure -->
    <xsl:template match="Call">
        <xsl:value-of select="@name"/> ( <xsl:for-each select="ParamVal">
            <xsl:value-of select="@name"/>
            <xsl:if test="position() != last()">
                <xsl:text>, </xsl:text>
            </xsl:if>
        </xsl:for-each>&#160;) <BR/>
    </xsl:template>
    <!-- Pour x de ... à ... Faire ... Fin Pour -->
    <xsl:template match="For">
        <b>Pour</b> &#160;<xsl:value-of select="key('idVar',@Var)"/>&#160;
        <b>De</b>&#160; <xsl:value-of select="@FirstValue"/>&#160; <b> à
            <!--xsl:value-of select="@Evol"/-->
        </b>&#160; <xsl:value-of select="@LastValue"/> &#160; <b>Faire</b>
        <BR/>
        <xsl:apply-templates select="Code">
            <xsl:with-param name="inc">yes</xsl:with-param>
        </xsl:apply-templates>
        <b>Fin Pour</b>
        <BR/>
    </xsl:template>
    <!-- Selon x Dans .... Fin Selon -->
    <xsl:template match="Switch">
        <B>Selon</B>&#160;<xsl:value-of select="key('idVar',@Var)"/>&#160;<b>dans</b>
        <BR/>
        <xsl:for-each select="Item">
            <xsl:for-each select="PossVal">
                <xsl:value-of select="."/>
                <xsl:if test="position() != last()">
                    <xsl:text>, </xsl:text>
                </xsl:if>
            </xsl:for-each> &#160;:&#160; <xsl:apply-templates select="Code"/>
        </xsl:for-each>
        <xsl:apply-templates select="DefaultItem"/>
        <B>Fin Selon</B>
        <BR/>
    </xsl:template>
    <xsl:template match="DefaultItem">
        <b>autrement :</b>
        <xsl:apply-templates select="Code">
            <xsl:with-param name="inc">yes</xsl:with-param>
        </xsl:apply-templates>
    </xsl:template>
    <xsl:template match="Let">
        <xsl:value-of select="@Var"/>:= <!--key('idVar',@Var)-->
        <xsl:value-of select="."/>
        <BR/>
    </xsl:template>
    <!-- Assertion -->
    <xsl:template match="Assert">
        <xsl:if test="./@Comment!='' "> //&#160;<xsl:value-of select="@Comment"/>
            <BR/>
        </xsl:if>
        <B>{</B>
        <xsl:value-of select="."/>
        <B>}</B>
        <BR/>
    </xsl:template>
    <!-- Si ... Alors ... Sinon ... -->
    <xsl:template match="If">
        <B>Si</B>&#160;<xsl:value-of select="Cond"/>
        <BR/>
        <xsl:apply-templates select="Then"/>
        <xsl:apply-templates select="Else"/>
        <B>Fin Si</B>
        <BR/>
    </xsl:template>
    <xsl:template match="Then">
        <B>Alors</B>
        <BR/>
        <xsl:apply-templates select="Code"/>
    </xsl:template>
    <xsl:template match="Else">
        <B>Sinon</B>
        <BR/>
        <xsl:apply-templates select="Code"/>
    </xsl:template>
</xsl:stylesheet>
