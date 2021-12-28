<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html"/>
    <xsl:key name="idVar" match="Var" use="@id"/>
    <xsl:template match="Algorithm">
        <html>
            <head>
                <title> Algorithme: <xsl:value-of select="@id"/>
                </title>
            </head>
            <body style="font-family:Arial; size:12pt;" link="#FFFF00" vLink="#FFFFFF" alink="#FF0000">
                <xsl:apply-templates/>
            </body>
        </html>
    </xsl:template>
    <xsl:template match="Function">
        <xsl:if test="./@PreCondition!='' "> //precondition:&#160;<xsl:value-of select="@PreCondition"/>
            <BR/>
        </xsl:if>
        <xsl:if test="./@PostCondition!='' "> //postcondition:&#160;<xsl:value-of select="@PostCondition"/>
            <BR/>
        </xsl:if>
        <BR/>
        <b>fonction</b> &#160;<xsl:value-of select="@name"/>(&#160; <xsl:value-of
        select="ParamDecl/Param/@Status"/>&#160; <xsl:value-of select="ParamDecl/Param/@id"/>:
            <xsl:value-of select="ParamDecl/Param/@Type"/>):&#160; <xsl:value-of select="RetValue/@Var"/>
        <br/>
        <xsl:if test="./@Comment!='' "> //&#160;<xsl:value-of select="@Comment"/>
            <BR/>
        </xsl:if>
        <xsl:apply-templates select="LocVarDecl"/>
        <B>d&#233;but</B>
        <BR/>
        <xsl:apply-templates select="Code"/>
        <B>fin</B>&#160;{<xsl:value-of select="@name"/>}<BR/>
        <BR/>
    </xsl:template>
    <xsl:template match="Procedure">
        <xsl:if test="./@PreCondition!='' "> //precondition:&#160;<xsl:value-of select="@PreCondition"/>
            <BR/>
        </xsl:if>
        <xsl:if test="./@PostCondition!='' "> //postcondition:&#160;<xsl:value-of select="@PostCondition"/>
            <BR/>
        </xsl:if>
        <b>procedure</b> &#160;<xsl:value-of select="@name"/>(&#160; <xsl:value-of
        select="ParamDecl/Param/@Status"/>&#160; <xsl:value-of select="ParamDecl/Param/@id"/>:
            <xsl:value-of select="ParamDecl/Param/@Type"/>)<br/>
        <xsl:if test="./@Comment!='' "> //&#160;<xsl:value-of select="@Comment"/>
            <BR/>
        </xsl:if>
        <xsl:apply-templates select="LocVarDecl"/>
        <B>d&#233;but</B>
        <BR/>
        <xsl:apply-templates select="Code"/>
        <B>fin</B>&#160;{<xsl:value-of select="@name"/>}<BR/>
        <BR/>
    </xsl:template>
    <xsl:template match="LocVarDecl">
        <xsl:apply-templates select="Var"/>
    </xsl:template>
    <xsl:template match="Var">
        <xsl:if test="position() = 1">
            <B>var</B>
            <br/>
        </xsl:if> &#160;&#160;&#160;&#160; <xsl:value-of
            select="@id"/>:<xsl:value-of select="@Type"/>
        <br/>
    </xsl:template>
    <xsl:template match="Code">
        <ul>
            <img src="" border="0" width="0" height="0"/>
            <xsl:apply-templates/>
        </ul>
    </xsl:template>
    <xsl:template match="While">
        <B>Tant que</B>&#160;<xsl:value-of select="Cond"/>
        <BR/>
        <xsl:apply-templates select="Code"/>
        <B>Fin Tant que</B>
        <BR/>
    </xsl:template>
    <xsl:template match="Repeat">
        <B>Repeter</B>
        <BR/>
        <xsl:apply-templates select="Code"/>
        <B>jusqu'&#224;</B>&#160;<xsl:value-of select="Cond"/>
        <BR/>
    </xsl:template>
    <xsl:template match="Call">
        <xsl:value-of select="@name"/> ( <xsl:for-each select="ParamVal">
            <xsl:value-of select="@name"/>
            <xsl:if test="position() != last()">
                <xsl:text>, </xsl:text>
            </xsl:if>
        </xsl:for-each>&#160;) <BR/>
    </xsl:template>
    <xsl:template match="For">
        <b>Pour</b> &#160;<xsl:value-of select="key('idVar',@Var)"/>&#160;
        <b>De</b>&#160; <xsl:value-of select="@FirstValue"/>&#160; <b>
            <xsl:value-of select="@Evol"/>
        </b>&#160; <xsl:value-of select="@LastValue"/>
        <BR/>
        <xsl:apply-templates select="Code"/>
        <b>Fin Pour</b>
        <BR/>
    </xsl:template>
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
        <xsl:apply-templates select="Code"/>
    </xsl:template>
    <xsl:template match="Let">
        <xsl:value-of select="@Var"/>:=
        <!--key('idVar',@Var)-->
        <xsl:value-of select="."/>
        <BR/>
    </xsl:template>
    <xsl:template match="Assert">
        <xsl:if test="./@Comment!='' "> //&#160;<xsl:value-of select="@Comment"/>
            <BR/>
        </xsl:if>
        <B>{</B>
        <xsl:value-of select="."/>
        <B>}</B>
        <BR/>
    </xsl:template>
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
